// app/users/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { getUsers } from "../../../lib/api";
import { User } from "../../../lib/types";
import Loader from "../../components/Loader";
import BackToHome from "../../components/BackToHome";

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 p-8 text-center">{error}</div>;
  if (users.length === 0) return <div className="text-gray-500 p-8 text-center">No users found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BackToHome />
      <h1 className="text-4xl font-bold text-brand-blue mb-8">Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-brand-blue text-white">
              <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Provider</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Confirmed</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {user.username}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                  {user.provider}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      user.confirmed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.confirmed ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-500">
        Total: {users.length} user{users.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
};

export default UsersPage;
