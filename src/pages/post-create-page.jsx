import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../utils/supabase';

/**
 * PostCreatePage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <PostCreatePage />
 */
function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleSubmit = async () => {
    setError('');

    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    const { error: dbError } = await supabase.from('posts').insert([
      {
        title,
        content,
        author: user.username,
        likes_count: 0,
      },
    ]);

    if (dbError) {
      setError('게시물 작성에 실패했습니다.');
      return;
    }

    navigate('/posts');
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton onClick={() => navigate('/posts')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            게시물 작성
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={10}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
          >
            업로드
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default PostCreatePage;
