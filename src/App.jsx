import { HashRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/login-page';
import SignupPage from './pages/signup-page';
import PostsListPage from './pages/posts-list-page';
import PostDetailPage from './pages/post-detail-page';
import PostCreatePage from './pages/post-create-page';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/posts" element={<PostsListPage />} />
        <Route path="/posts/new" element={<PostCreatePage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
