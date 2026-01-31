/**
 * Skeleton Loaders - Content-aware loading placeholders
 * Each skeleton matches the exact layout of its corresponding component
 */

// ============================================================
// POST SKELETON - Matches the Post component layout
// ============================================================
export const PostSkeleton = () => (
  <div className="border-b-2 border-gray-300 p-2 pr-1 flex flex-row gap-1 sm:gap-2 h-fit min-w-[350px] md:min-w-[450px] lg:min-w-[500px] xl:w-[700px] wide:w-[850px] animate-pulse">
    {/* Avatar */}
    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
    
    <div className="flex flex-col gap-2 w-full">
      {/* User info row */}
      <div className="flex flex-row gap-2 items-center">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-20" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
      
      {/* Post content */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
      
      {/* Post image placeholder (optional) */}
      <div className="h-48 bg-gray-200 rounded-lg w-full mt-2" />
      
      {/* Actions row */}
      <div className="flex gap-6 mt-2">
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-16" />
        <div className="h-6 bg-gray-200 rounded w-16" />
      </div>
    </div>
  </div>
);

// Multiple posts skeleton
export const PostListSkeleton = ({ count = 3 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <PostSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// ADMIN CARD SKELETON - Matches AdminCard component
// ============================================================
export const AdminCardSkeleton = () => (
  <div className="animate-pulse bg-gray-100 rounded-xl p-4 w-[150px] md:w-[180px]">
    <div className="flex justify-between items-start mb-3">
      <div className="h-10 w-10 bg-gray-200 rounded-lg" />
      <div className="h-8 w-8 bg-gray-200 rounded-full" />
    </div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-8 bg-gray-200 rounded w-1/2" />
  </div>
);

export const AdminCardListSkeleton = ({ count = 5 }) => (
  <div className="flex flex-row gap-4 md:justify-between justify-center flex-wrap p-5">
    {Array.from({ length: count }).map((_, i) => (
      <AdminCardSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// ANNOUNCEMENT SKELETON - Matches Announcement component
// ============================================================
export const AnnouncementSkeleton = () => (
  <div className="animate-pulse p-3 border-b border-gray-200">
    <div className="flex items-center gap-2 mb-2">
      <div className="h-4 bg-gray-200 rounded w-24" />
      <div className="h-3 bg-gray-200 rounded w-3" />
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 rounded w-full" />
      <div className="h-3 bg-gray-200 rounded w-4/5" />
    </div>
  </div>
);

export const AnnouncementListSkeleton = ({ count = 4 }) => (
  <div className="bg-greyish rounded-[2rem] p-4 my-4 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
    {Array.from({ length: count }).map((_, i) => (
      <AnnouncementSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// RESOURCE CARD SKELETON - Matches ResourceCard component
// ============================================================
export const ResourceCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md p-4 w-[280px] h-[200px]">
    <div className="flex items-start justify-between mb-3">
      <div className="h-10 w-10 bg-gray-200 rounded" />
      <div className="h-6 bg-gray-200 rounded w-16" />
    </div>
    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
    <div className="h-3 bg-gray-200 rounded w-full mb-1" />
    <div className="h-3 bg-gray-200 rounded w-5/6 mb-3" />
    <div className="flex justify-between items-center mt-auto">
      <div className="h-3 bg-gray-200 rounded w-20" />
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  </div>
);

export const ResourceListSkeleton = ({ count = 4 }) => (
  <div className="px-[1em] md:px-[2em] lg:px-[0.3em] pt-4 flex flex-wrap gap-4 justify-around">
    {Array.from({ length: count }).map((_, i) => (
      <ResourceCardSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// PROFILE SKELETON - Matches Profile page layout
// ============================================================
export const ProfileSkeleton = () => (
  <div className="animate-pulse p-4">
    {/* Profile header */}
    <div className="flex flex-col items-center mb-6">
      <div className="w-24 h-24 bg-gray-200 rounded-full mb-4" />
      <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-48" />
    </div>
    
    {/* Stats row */}
    <div className="flex justify-center gap-8 mb-6">
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-12" />
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="text-center">
        <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1" />
        <div className="h-3 bg-gray-200 rounded w-14" />
      </div>
    </div>
    
    {/* Bio */}
    <div className="space-y-2 mb-6">
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
    </div>
    
    {/* Action buttons */}
    <div className="flex gap-4 justify-center">
      <div className="h-10 bg-gray-200 rounded-lg w-28" />
      <div className="h-10 bg-gray-200 rounded-lg w-28" />
    </div>
  </div>
);

// ============================================================
// TABLE ROW SKELETON - For tables (payments, users, etc.)
// ============================================================
export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="animate-pulse border-b">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-gray-200 rounded w-full" />
      </td>
    ))}
  </tr>
);

export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">
      <thead>
        <tr className="animate-pulse">
          {Array.from({ length: columns }).map((_, i) => (
            <th key={i} className="px-4 py-3">
              <div className="h-4 bg-gray-300 rounded w-20" />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </tbody>
    </table>
  </div>
);

// ============================================================
// PAYMENT SKELETON - Matches RecentPayments component
// ============================================================
export const PaymentSkeleton = () => (
  <div className="animate-pulse flex items-center justify-between p-4 border-b">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
      <div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
        <div className="h-3 bg-gray-200 rounded w-24" />
      </div>
    </div>
    <div className="text-right">
      <div className="h-4 bg-gray-200 rounded w-20 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-16" />
    </div>
  </div>
);

export const PaymentListSkeleton = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <PaymentSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// EVENT CARD SKELETON - Matches Event card layout
// ============================================================
export const EventCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-[300px]">
    <div className="h-40 bg-gray-200" />
    <div className="p-4">
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  </div>
);

export const EventListSkeleton = ({ count = 3 }) => (
  <div className="flex flex-wrap gap-4 justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// BLOG CARD SKELETON - Matches BlogCard component
// ============================================================
export const BlogCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow-md overflow-hidden w-full sm:w-[350px]">
    <div className="h-48 bg-gray-200" />
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
        <div className="h-3 bg-gray-200 rounded w-4/6" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

export const BlogListSkeleton = ({ count = 3 }) => (
  <div className="flex flex-wrap gap-6 justify-center">
    {Array.from({ length: count }).map((_, i) => (
      <BlogCardSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// NOTIFICATION SKELETON - Matches Notification component
// ============================================================
export const NotificationSkeleton = () => (
  <div className="animate-pulse flex items-start gap-3 p-3 border-b">
    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
    <div className="h-3 bg-gray-200 rounded w-12" />
  </div>
);

export const NotificationListSkeleton = ({ count = 5 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <NotificationSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// COMMENT SKELETON - Matches PostComments component
// ============================================================
export const CommentSkeleton = () => (
  <div className="animate-pulse flex gap-3 p-3 border-b">
    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
      <div className="space-y-1">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
      </div>
      <div className="flex gap-4 mt-2">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-12" />
      </div>
    </div>
  </div>
);

export const CommentListSkeleton = ({ count = 4 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <CommentSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// USER CARD SKELETON - For user lists
// ============================================================
export const UserCardSkeleton = () => (
  <div className="animate-pulse flex items-center gap-3 p-3 border-b">
    <div className="w-12 h-12 bg-gray-200 rounded-full" />
    <div className="flex-1">
      <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
      <div className="h-3 bg-gray-200 rounded w-24" />
    </div>
    <div className="h-8 bg-gray-200 rounded w-16" />
  </div>
);

export const UserListSkeleton = ({ count = 6 }) => (
  <div>
    {Array.from({ length: count }).map((_, i) => (
      <UserCardSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// LEVEL DROPDOWN SKELETON - For Resources page levels
// ============================================================
export const LevelDropdownSkeleton = () => (
  <div className="animate-pulse px-4 pt-6 pb-4 flex items-center flex-col">
    <div className="w-full h-8 bg-gray-300 rounded-lg" />
  </div>
);

export const ResourcePageSkeleton = () => (
  <div className="lg:pt-5 gap:4 w-full">
    {Array.from({ length: 5 }).map((_, i) => (
      <LevelDropdownSkeleton key={i} />
    ))}
  </div>
);

// ============================================================
// HOME PAGE SKELETON - Complete Home page layout
// ============================================================
export const HomePageSkeleton = () => (
  <div className="flex flex-col relative w-full">
    {/* Header skeleton */}
    <div className="sticky top-0 z-[300] bg-white w-full p-4 border-b">
      <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
    </div>
    
    {/* Posts skeleton */}
    <PostListSkeleton count={3} />
  </div>
);

// ============================================================
// ADMIN DASHBOARD SKELETON - Complete admin layout
// ============================================================
export const AdminDashboardSkeleton = () => (
  <div className="w-full">
    {/* Header */}
    <div className="p-4 border-b">
      <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
    </div>
    
    {/* Stats cards */}
    <AdminCardListSkeleton count={5} />
    
    {/* Tables section */}
    <div className="p-5 flex flex-row flex-wrap gap-4">
      <div className="animate-pulse bg-yellow-50 w-fit p-4 rounded-xl">
        <div className="h-6 bg-gray-200 rounded w-32 mb-4" />
        <div className="space-y-2">
          <div className="h-10 bg-gray-200 rounded w-64" />
          <div className="h-10 bg-gray-200 rounded w-64" />
          <div className="h-10 bg-gray-200 rounded w-64" />
        </div>
      </div>
      
      <div className="animate-pulse bg-green-50 w-fit p-4 rounded-xl">
        <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
        <TableSkeleton rows={6} columns={4} />
      </div>
    </div>
    
    {/* Recent payments */}
    <div className="p-4">
      <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
      <PaymentListSkeleton count={5} />
    </div>
  </div>
);
