const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(helmet());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "biblioteca"
});

db.connect(err => {
    if (err) throw err;
    console.log('Conectado com o BD');
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Message: "We need token please provide it." });
    } else {
        jwt.verify(token, "our-jsonwebtoken-secret-key", (err, decoded) => {
            if (err) {
                return res.json({ Message: "Authentication Error." });
            } else {
                req.name = decoded.name;
                next();
            }
        });
    }
};

/* const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limite de 5 tentativas
    message: "Muitas tentativas de login. Tente novamente mais tarde."
}); */

app.get('/', verifyUser, (req, res) => {
    return res.json({ Message: "Success", name: req.name });
});

app.get('/User', verifyUser, (req, res) => {
    const sql = 'SELECT * FROM usuario WHERE Nome = ?';
    db.query(sql, [req.name], (err, data) => {
        if (err) return res.json({ Message: "Erro ao buscar dados do usuário" });
        if (data.length > 0) {
            return res.json({ Status: "Success", user: data[0] });
        } else {
            return res.json({ Message: "Usuário não encontrado" });
        }
    });
});


app.post("/Login", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    console.log("Dados da requisição:", req.body); // Log dos dados recebidos

    const sql = 'SELECT * FROM usuario WHERE Email = ?';
    db.query(sql, [req.body.email], (err, data) => {
        if (err) {
            console.error("Erro na consulta ao banco de dados:", err);
            return res.json({ Message: "Server Side Error" });
        }

        console.log("Dados retornados da consulta:", data); // Log dos dados retornados

        if (data.length > 0) {
            const user = data[0];
            const name = user.Nome;

            // Verifica a senha usando bcrypt
            bcrypt.compare(req.body.password, user.Senha, (err, match) => {
                if (err) {
                    return res.status(500).json({ Message: "Erro ao verificar a senha" });
                }
                if (match) {
                    const token = jwt.sign({ name }, 'our-jsonwebtoken-secret-key', { expiresIn: "1d" });
                    res.cookie('token', token, { httpOnly: true });
                    return res.json({ Status: "Success", name });
                } else {
                    return res.status(401).json({ Message: "Senha incorreta" });
                }
            });
        } else {
            return res.status(404).json({ Message: "Teste não encontrado" });
        }
    });
});



app.get('/Logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
});

app.get('/livros/:id/disponibilidade', (req, res) => {
    const livroId = req.params.id;
    const sql = 'SELECT qtd FROM livros WHERE id = ?';
    db.query(sql, [livroId], (err, data) => {
      if (err) return res.json({ Message: "Erro ao buscar disponibilidade do livro" });
      if (data.length > 0 && data[0].qtd > 0) {
        return res.json({ disponivel: true });
      } else {
        return res.json({ disponivel: false });
      }
    });
  });
  

app.get('/Livros', (req, res) => {
    const sql = "SELECT * FROM livro;";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/Historia', (req, res) => {
    const sql = "SELECT * FROM livro WHERE categoria LIKE '%Historia%';";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/Biografias', (req, res) => {
    const sql = "SELECT * FROM livro WHERE categoria LIKE '%Biografias%';";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    });
});

app.get('/Eventos', (req, res) => {
    const sql = "SELECT * FROM evento;";
    db.query(sql, (err, data) => {
        if (err) return res.json({ Message: "Erro ao buscar eventos" });
        return res.json(data);
    });
});

app.post("/Register", [
    body('name').notEmpty().withMessage('O nome é obrigatório.'),
    body('email').isEmail().withMessage('O email deve ser válido.'),
    body('password').isLength({ min: 5 }).withMessage('A senha deve ter pelo menos 5 caracteres.')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Verificar se o email já está cadastrado
    const checkEmailSql = 'SELECT * FROM usuario WHERE Email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ Message: "Erro no servidor" });
        }
        if (results.length > 0) {
            return res.status(400).json({ Message: "Email já cadastrado." });
        }

        // Criptografar a senha
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ Message: "Erro ao criptografar a senha" });
            }

            // Inserir o novo usuário no banco de dados
            const insertSql = 'INSERT INTO usuario (Nome, Email, Senha) VALUES (?, ?, ?)';
            db.query(insertSql, [name, email, hash], (err, results) => {
                if (err) {
                    return res.status(500).json({ Message: "Erro ao registrar o usuário" });
                }
                return res.status(201).json({ Status: "Success", Message: "Usuário registrado com sucesso." });
            });
        });
    });
});


app.post("/aluguel", [
    body('usuario_id').isInt().withMessage('O ID do usuário deve ser um número inteiro.'),
    body('livro_id').isInt().withMessage('O ID do livro deve ser um número inteiro.'),
    body('data_inicio').isISO8601().withMessage('A data de início deve ser uma data válida.'),
    body('data_devolucao').isISO8601().withMessage('A data de devolução deve ser uma data válida.'),
    body('observacoes').optional().isString().withMessage('Observações devem ser uma string.')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { usuario_id, livro_id, data_inicio, data_devolucao, observacoes } = req.body;

    // Verifica se o usuário já possui um aluguel ativo
    const checkUserSql = 'SELECT * FROM aluguel WHERE usuario_id = ? AND status = "ativo"';
    db.query(checkUserSql, [usuario_id], (err, userResults) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao verificar aluguéis anteriores" });
        }

        if (userResults.length > 0) {
            return res.status(400).json({ message: "O usuário já possui um livro alugado e ativo." });
        }

        // Contar total de livros disponíveis e quantos estão alugados
        const countSql = 'SELECT qtd FROM livro WHERE ID = ?';
        db.query(countSql, [livro_id], (err, livroResults) => {
            if (err) {
                return res.status(500).json({ message: "Erro ao verificar a disponibilidade do livro" });
            }

            if (livroResults.length === 0) {
                return res.status(404).json({ message: "Livro não encontrado." });
            }

            const totalLivros = livroResults[0].qtd;

            // Contar quantos livros estão alugados (status "solicitado")
            const countAlugadosSql = 'SELECT COUNT(*) AS totalAlugados FROM aluguel WHERE livro_id = ? AND status = "solicitado"';
            db.query(countAlugadosSql, [livro_id], (err, alugadosResults) => {
                if (err) {
                    return res.status(500).json({ message: "Erro ao contar livros alugados" });
                }

                const totalAlugados = alugadosResults[0].totalAlugados;

                // Calcular a disponibilidade
                const disponibilidade = totalLivros - totalAlugados;

                if (disponibilidade <= 0) {
                    return res.status(400).json({ message: "Livro não está disponível para aluguel." });
                }

                // Se não houver aluguel ativo e o livro estiver disponível, prossegue com a inserção do novo aluguel
                const insertSql = 'INSERT INTO aluguel (usuario_id, livro_id, data_inicio, data_devolucao, status, observacoes) VALUES (?, ?, ?, ?, ?, ?)';
                
                // Definindo o status como "solicitado"
                const status = 'solicitado';

                db.query(insertSql, [usuario_id, livro_id, data_inicio, data_devolucao, status, observacoes], (err, results) => {
                    if (err) {
                        return res.status(500).json({ message: "Erro ao criar aluguel" });
                    }
                    res.status(201).json({
                        id: results.insertId,
                        usuario_id,
                        livro_id,
                        data_inicio,
                        data_devolucao,
                        status,
                        observacoes
                    });
                });
            });
        });
    });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ Message: "Erro no servidor" });
});

app.listen(8088, () => {
    console.log("Rodando na porta: 8088");
});
