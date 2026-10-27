import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  const initials = user.fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between border-b border-gray-200 pb-5">
          <span className="text-lg font-bold tracking-tight">
            account<span className="text-gray-400">.</span>
          </span>

          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm hover:border-black"
          >
            Sign out
          </button>
        </header>

        <section className="mt-10">
          <p className="text-sm text-gray-500">Your account</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Dashboard
          </h1>

          <div className="mt-8 flex items-center gap-4 border-b border-gray-200 pb-8">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-lg font-medium">
                {initials}
              </div>
            )}

            <div>
              <h2 className="text-lg font-medium">{user.fullName}</h2>
              <p className="mt-1 text-sm text-gray-500">{user.email}</p>
              <p className="mt-1 text-sm text-gray-500">@{user.username}</p>
            </div>
          </div>

          <div className="mt-7 max-w-xl">
            <h2 className="text-sm font-semibold">Account details</h2>

            <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
              <div className="flex justify-between gap-4 py-4 text-sm">
                <span className="text-gray-500">Full name</span>
                <span className="text-right">{user.fullName}</span>
              </div>

              <div className="flex justify-between gap-4 py-4 text-sm">
                <span className="text-gray-500">Username</span>
                <span className="text-right">@{user.username}</span>
              </div>

              <div className="flex justify-between gap-4 py-4 text-sm">
                <span className="text-gray-500">Email</span>
                <span className="break-all text-right">{user.email}</span>
              </div>

              <div className="flex justify-between gap-4 py-4 text-sm">
                <span className="text-gray-500">Member since</span>
                <span className="text-right">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Dashboard;