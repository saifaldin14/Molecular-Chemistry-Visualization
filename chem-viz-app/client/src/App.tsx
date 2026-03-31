import { Routes, Route } from 'react-router-dom';
import DocumentList from './pages/DocumentList';
import DocumentEditor from './pages/DocumentEditor';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<DocumentList />} />
        <Route path="/document/:id" element={<DocumentEditor />} />
      </Routes>
    </div>
  );
}
