import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { supabase } from '../utils/supabase';

/**
 * SignupPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <SignupPage />
 */
function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async () => {
    setError('');
    setSuccess('');

    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (username.length < 3) {
      setError('아이디는 3자 이상이어야 합니다.');
      return;
    }

    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    const { error: dbError } = await supabase
      .from('users')
      .insert([{ username, password }]);

    if (dbError) {
      if (dbError.code === '23505') {
        setError('이미 존재하는 아이디입니다.');
      } else {
        setError('회원가입에 실패했습니다.');
      }
      return;
    }

    setSuccess('회원가입이 완료되었습니다!');
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        }}
      >
        <Container maxWidth="sm">
          <Paper sx={{ p: { xs: 3, md: 4 } }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                textAlign: 'center',
                mb: 4,
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              회원가입
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              fullWidth
              label="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSignup}
            >
              회원가입 하기
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default SignupPage;
