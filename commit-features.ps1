# Commit features one by one. Run from repo root: .\commit-features.ps1
# Each block stages related files and commits with a conventional message.

$ErrorActionPreference = "Stop"

# 1. UI: header search and sidebar
git add frontend/src/components/nav/HeaderComponent.jsx frontend/src/components/nav/Sidebar.jsx
git commit -m "fix(ui): search button height matches input, spacing with hamburger, sidebar label Payments"

# 2. Backend: combined feed endpoint and response compression
git add backend/controllers/postController.js backend/routes/userRoutes.js backend/utils/server.js package.json
git commit -m "feat(api): GET /api/v1/users/feed (posts + unreadNotificationsCount), add compression middleware"

# 3. Frontend: feed query, Home use feed, prefetch, unread count
git add frontend/src/redux/slices/postSlice.js frontend/src/redux/slices/authSlice.js frontend/src/redux/index.js
git add frontend/src/pages/Home.jsx frontend/src/components/nav/Sidebar.jsx frontend/src/redux/slices/apiSlice.js
git commit -m "feat(home): use feed endpoint for one round trip, prefetch next page, unread count from feed"

# 4. Performance doc
git add docs/PERFORMANCE.md
git commit -m "docs: update PERFORMANCE.md with implemented optimizations"

# 5. Remove unused packages (root and frontend)
git add package.json frontend/package.json
git commit -m "chore(deps): remove unused packages (root and frontend)"

# 6. Remove single post (Comments) page, route, and navigation to it
git add frontend/src/main.jsx frontend/src/pages/index.js
git add frontend/src/components/Actions.jsx frontend/src/components/PostSearch.jsx frontend/src/components/Notification.jsx frontend/src/components/CommentActions.jsx
git add frontend/src/pages/Comments.jsx
git commit -m "refactor(app): remove Comments page and /comments/:postId route, link to home instead"

# 7. Remove unused components (Report, FileProvider)
git add frontend/src/components/Report.jsx frontend/src/components/FileProvider.jsx
git commit -m "chore(frontend): remove unused Report and FileProvider components"

# 8. Hide announcement section scrollbar; fix Home prefetch options
git add frontend/src/components/AnnouncementContainer.jsx frontend/src/index.css frontend/src/pages/Home.jsx
git commit -m "fix(ui): hide announcement section scrollbar; fix RTK Query prefetch options in Home"

# 9. Backend: user blocking (isBlocked, protect check, block/unblock routes)
git add backend/models/userModel.js backend/middleware/authMiddleware.js backend/controllers/adminController.js backend/routes/adminRoutes.js
git commit -m "feat(backend): user blocking - isBlocked on user, protect check, block/unblock admin routes"

# 10. Frontend: Admin Users page and block/unblock API
git add frontend/src/redux/slices/adminApiSlice.js frontend/src/pages/AdminUsers.jsx frontend/src/main.jsx frontend/src/redux/index.js
git add frontend/src/redux/slices/apiSlice.js frontend/src/pages/Signin.jsx
git commit -m "feat(admin): Admin Users page, block/unblock API, handle 403 blocked in API and Signin"

# 11. Navbar refactor and landing nav (remove E-Test from nav)
git add frontend/src/components/nav/NavBar.jsx frontend/src/constants/index.js
git commit -m "fix(nav): navbar refactor, hamburger in header, remove E-Test from landing nav"

# 12. Search: use Post component for results, fix PostSearch (no navigation, duplicate userId)
git add frontend/src/pages/Search.jsx frontend/src/components/PostSearch.jsx
git commit -m "refactor(search): use Post component for post results (inline comments), fix PostSearch linter"

# 13. Resource slice (RTK Query) and resource pages
git add frontend/src/redux/slices/resourceSlice.js frontend/src/pages/Resources.jsx frontend/src/pages/LevelResources.jsx
git add frontend/src/components/ResourceCard.jsx frontend/src/components/ResourceSearch.jsx frontend/src/redux/index.js
git commit -m "feat(resources): RTK Query resource slice, cache; update Resources and LevelResources pages"

# 14. E-Test admin: reorder, question form, OCR utils
git add backend/controllers/etestAdminController.js backend/routes/adminRoutes.js backend/utils/etestUtils/
git add frontend/src/redux/slices/adminApiSlice.js frontend/src/pages/AdminETest.jsx frontend/src/pages/AdminETestCourse.jsx frontend/src/pages/AdminETestTest.jsx
git add frontend/src/components/forms/QuestionForm.jsx
git commit -m "feat(etest-admin): question reorder endpoint, OCR utils, QuestionForm, reorder mutation and UX"

# 15. UI fixes: 3-dots menu, responsive text, FAQs image, floating button, modal
git add frontend/src/components/Post.jsx frontend/src/components/PostComments.jsx frontend/src/components/Event.jsx
git add frontend/src/components/Modal.jsx frontend/src/sections/FAQs.jsx frontend/src/index.css
git add frontend/src/components/InfiniteScrollSentinel.jsx frontend/src/hooks/useInfiniteScroll.js
git commit -m "fix(ui): 3-dots menu visibility and z-index, responsive text, FAQs image, floating add-post button, modal"

# 16. ConfirmDialog, ErrorBoundary, forms and payment components
git add frontend/src/components/ConfirmDialog.jsx frontend/src/components/ErrorBoundary.jsx
git add frontend/src/components/forms/AddCategoryForm.jsx frontend/src/components/forms/DeleteCategoryForm.jsx
git add frontend/src/components/forms/AddPostForm.jsx frontend/src/components/forms/EditProfileForm.jsx
git add frontend/src/components/forms/EventForm.jsx frontend/src/components/forms/FileForm.jsx
git add frontend/src/components/forms/ContactForm.jsx frontend/src/components/forms/VerifyAccountInput.jsx
git add frontend/src/components/PaymentHistory.jsx frontend/src/components/PaymentList.jsx
git add frontend/src/components/index.js
git commit -m "fix(ui): ConfirmDialog, ErrorBoundary, form and payment component updates"

# 17. Admin and user pages (dashboard, announcements, blogs, events, payment, verify, profile)
git add frontend/src/pages/AdminDashboard.jsx frontend/src/pages/AdminAnnouncement.jsx frontend/src/pages/AdminBlogs.jsx
git add frontend/src/pages/AdminEvents.jsx frontend/src/pages/AdminPayment.jsx frontend/src/pages/VerifyUsers.jsx
git add frontend/src/pages/Profile.jsx frontend/src/pages/UserProfile.jsx frontend/src/pages/NotificationPage.jsx
git commit -m "fix(pages): Admin dashboard, announcements, blogs, events, payment, VerifyUsers, Profile, UserProfile, NotificationPage"

# 18. Backend models (indexes), resourceLogic, nav slice, vite config
git add backend/models/announcementModel.js backend/models/blogModel.js backend/models/eventModel.js
git add backend/models/notificationModel.js backend/models/paymentModel.js backend/models/postModel.js
git add backend/utils/resourceLogic.js frontend/src/redux/slices/navSlice.js frontend/vite.config.js
git commit -m "chore: backend model indexes, resourceLogic, navSlice, vite config"

# 19. Commit script and tsconfig
git add commit-features.ps1 frontend/tsconfig.json
git commit -m "chore: add commit-features.ps1 and frontend tsconfig"

Write-Host "Done. Review with: git log --oneline -n 25"
