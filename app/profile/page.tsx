import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/user/user.service";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    redirect("/login");
  }

  const userData = await getUserProfile(session.accessToken);
  console.log(userData);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-gray-700 rounded-lg shadow p-6">
        <p>
          <strong>Name:</strong> {userData?.name}
        </p>
        <p>
          <strong>Email:</strong> {userData?.email}
        </p>
        <p>
          <strong>Status:</strong> {userData?.status}
        </p>
        <p>
          <strong>Last login:</strong> {userData?.lastLogin}
        </p>
      </div>
    </div>
  );
}
