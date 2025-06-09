import { toast } from 'sonner';
import useCourseStore from '@/store/courseStore';

export const useResourceManagement = () => {
  const { currentResource, updateCurrentResource, addResource, removeResource } = useCourseStore();

  const handleResourceChange = (e) => {
    const { name, value } = e.target;
    updateCurrentResource({ [name]: value });
  };

  const handleAddResource = () => {
    if (!currentResource.title || !currentResource.url) {
      toast.error("Resource title and URL are required");
      return;
    }
    addResource();
    toast.success("Resource added successfully");
  };

  return {
    currentResource,
    updateCurrentResource,
    handleResourceChange,
    handleAddResource,
    removeResource
  };
};