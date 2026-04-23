import { useNavigate } from 'react-router-dom';
import BlogEditor from '../../features/blog/components/BlogEditor';
import { useBlogPosts } from '../../features/blog/context';
import type { BlogPostCreatePayload } from '../../features/blog/types';

export default function BlogCreatePage() {
  const { createPost } = useBlogPosts();
  const navigate = useNavigate();

  const handleCreate = async (payload: BlogPostCreatePayload) => {
    await createPost(payload);
    navigate('/blogs');
  };

  return (
    <BlogEditor
      onCancel={() => navigate('/blogs')}
      onSubmitCreate={handleCreate}
    />
  );
}
