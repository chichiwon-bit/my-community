import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  IconButton,
  TextField,
  Divider,
  List,
  ListItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { supabase } from '../utils/supabase';

/**
 * PostDetailPage 컴포넌트
 *
 * Props: 없음
 *
 * Example usage:
 * <PostDetailPage />
 */
function PostDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPost();
      fetchComments();
      checkLikeStatus();
    }
  }, [id, user]);

  const fetchPost = async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (data) {
      setPost(data);
    }
  };

  const fetchComments = async () => {
    const { data } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data);
    }
  };

  const checkLikeStatus = async () => {
    const { data } = await supabase
      .from('likes')
      .select('*')
      .eq('post_id', id)
      .eq('username', user?.username)
      .single();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('post_id', id)
        .eq('username', user.username);

      await supabase
        .from('posts')
        .update({ likes_count: (post.likes_count || 1) - 1 })
        .eq('id', id);
    } else {
      await supabase
        .from('likes')
        .insert([{ post_id: id, username: user.username }]);

      await supabase
        .from('posts')
        .update({ likes_count: (post.likes_count || 0) + 1 })
        .eq('id', id);
    }

    setIsLiked(!isLiked);
    fetchPost();
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await supabase.from('comments').insert([
      {
        content: newComment,
        author: user.username,
        post_id: id,
      },
    ]);

    setNewComment('');
    fetchComments();
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

  if (!post) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', minHeight: '100vh' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <IconButton onClick={() => navigate('/posts')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '1.25rem', md: '1.5rem' },
            }}
          >
            {post.title}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            <Typography variant="body2">{post.author}</Typography>
            <Typography variant="body2">{formatDate(post.created_at)}</Typography>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Typography
            variant="body1"
            sx={{ mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.8 }}
          >
            {post.content}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handleLike} color={isLiked ? 'error' : 'default'}>
              {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Typography>{post.likes_count || 0}</Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            댓글 {comments.length}개
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              size="small"
            />
            <Button variant="contained" onClick={handleAddComment}>
              등록
            </Button>
          </Box>

          <List disablePadding>
            {comments.length === 0 ? (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                댓글이 없습니다.
              </Typography>
            ) : (
              comments.map((comment, index) => (
                <ListItem
                  key={comment.id}
                  sx={{
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    py: 2,
                    borderBottom: index < comments.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 0.5,
                      color: 'text.secondary',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {comment.author}
                    </Typography>
                    <Typography variant="caption">
                      {formatDate(comment.created_at)}
                    </Typography>
                  </Box>
                  <Typography variant="body2">{comment.content}</Typography>
                </ListItem>
              ))
            )}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
