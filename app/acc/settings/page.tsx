'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useTheme } from '@/lib/hooks/useTheme';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }
      setUser(user);
      setLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    setMessage(null);

    try {
      // Mark account for deletion (soft delete)
      // In Supabase, you would typically update a user metadata field
      // The actual deletion would be handled by a cron job after 7 days
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          deletion_requested_at: new Date().toISOString(),
          deletion_scheduled: true
        }
      });

      if (updateError) throw updateError;

      setMessage({
        type: 'success',
        text: 'Account deletion scheduled. You have 7 days to cancel by logging in again.',
      });

      // Sign out after scheduling deletion
      setTimeout(async () => {
        await supabase.auth.signOut();
        router.push('/');
      }, 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to delete account' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          deletion_requested_at: null,
          deletion_scheduled: false
        }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Account deletion cancelled!' });
      setUser({ ...user, user_metadata: { ...user.user_metadata, deletion_scheduled: false } });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to cancel deletion' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  const isDeletionScheduled = user?.user_metadata?.deletion_scheduled;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 -z-10" />

      {/* Header */}
      <header className="sticky top-0 left-0 right-0 z-50 border-b border-white/20 dark:border-white/10 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/chat" className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Nova AI
            </h1>
          </Link>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl p-8 md:p-12">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Account Settings
            </h1>

            {/* Message */}
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-xl ${
                  message.type === 'error'
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                }`}
              >
                {message.text}
              </motion.div>
            )}

            {/* Account Info */}
            <div className="mb-8 p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Account Information</h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Email: </span>
                  <span className="font-medium text-gray-900 dark:text-white">{user?.email}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Account created: </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Deletion Warning */}
            {isDeletionScheduled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-6 rounded-2xl bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">
                      Account Deletion Scheduled
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-400 mb-4">
                      Your account is scheduled for deletion. It will be permanently deleted after 7 days.
                      Log in again within this period to cancel the deletion.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancelDeletion}
                      className="px-6 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
                    >
                      Cancel Deletion
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              {/* Sign Out */}
              <div className="p-6 rounded-2xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sign Out</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Sign out of your Nova AI account on this device.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="px-6 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white font-medium transition-colors"
                >
                  Sign Out
                </motion.button>
              </div>

              {/* Delete Account */}
              {!isDeletionScheduled && (
                <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                  <h2 className="text-xl font-semibold mb-2 text-red-700 dark:text-red-400">Danger Zone</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Permanently delete your Nova AI account. This action cannot be undone, but you have 7 days to cancel.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteDialog(true)}
                    className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  >
                    Delete Account
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Delete Account?
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete your account? Your account will be scheduled for deletion and permanently removed after 7 days. You can cancel this action by logging in again within 7 days.
            </p>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-6 py-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowDeleteDialog(false);
                  handleDeleteAccount();
                }}
                disabled={deleteLoading}
                className="flex-1 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
