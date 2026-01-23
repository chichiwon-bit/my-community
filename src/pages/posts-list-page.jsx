import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  List,
  ListItem,
  ListItemButton,
  Pagination,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import { supabase } from '../utils/supabase';

/**
 * PostsListPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <PostsListPage />
 */
function PostsListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);
  const postsPerPage = 10;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    const { count } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true });

    setTotalPages(Math.ceil((count || 0) / postsPerPage));

    const from = (page - 1) * postsPerPage;
    const to = from + postsPerPage - 1;

    const { data } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (data) {
      const postsWithComments = await Promise.all(
        data.map(async (post) => {
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);
          return { ...post, commentCount: commentCount || 0 };
        })
      );
      setPosts(postsWithComments);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          py: 2,
          px: { xs: 2, md: 3 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
        >
          {user?.username}님 환영합니다.
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/posts/new')}
            size="small"
          >
            글쓰기
          </Button>
          <Button variant="outlined" onClick={handleLogout} size="small">
            로그아웃
          </Button>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 3,
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', md: '2rem' },
          }}
        >
          hell스터디
        </Typography>

        <Paper>
          <List disablePadding>
            {posts.length === 0 ? (
              <ListItem>
                <Typography sx={{ py: 4, width: '100%', textAlign: 'center' }}>
                  게시물이 없습니다.
                </Typography>
              </ListItem>
            ) : (
              posts.map((post, index) => (
                <ListItem
                  key={post.id}
                  disablePadding
                  divider={index < posts.length - 1}
                >
                  <ListItemButton
                    onClick={() => navigate(`/posts/${post.id}`)}
                    sx={{ py: 2 }}
                  >
                    <Box sx={{ width: '100%' }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 'bold', mb: 0.5 }}
                      >
                        {post.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.content}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {post.author}
                        </Typography>
                        <Chip
                          icon={<FavoriteIcon sx={{ fontSize: 14 }} />}
                          label={post.likes_count || 0}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20 }}
                        />
                        <Chip
                          icon={<CommentIcon sx={{ fontSize: 14 }} />}
                          label={post.commentCount}
                          size="small"
                          variant="outlined"
                          sx={{ height: 20 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(post.created_at)}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))
            )}
          </List>
        </Paper>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PostsListPage;
