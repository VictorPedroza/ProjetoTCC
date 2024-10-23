import { Navbar } from './components/Navbar/Navbar'; 
import { Routes, Route } from 'react-router-dom';
import Home from './components/Pages/Home';
import Livros from './components/Pages/Livros';
import Eventos from './components/Pages/Eventos';
import AdminRedirect from './components/AdminRedirect';
import Perfil from './components/Pages/Perfil';
import LivroDetalhes from './components/Card/LivroDetalhes';
import './App.css';
import Login from './components/Pages/Login';
import Footer from './components/Footer/Footer';
import Register from './components/Pages/Register';
function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/Livros' element={<Livros />} />
        <Route path="/livro/:id" element={<LivroDetalhes />} />
        <Route path='/Eventos' element={<Eventos />} />
        <Route path='/Perfil' element={<Perfil />} />
        <Route path='/admin' element={<AdminRedirect />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Register' element={< Register />}/>
      </Routes>
      <Footer />
    </div>
  )
}

export default App;
