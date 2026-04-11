import LoginForm from "../components/LoginForm";

export const metadata = {
  title: "Login - Youcourse",
  description: "Sign in to your account",
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>
        <LoginForm />
      </div>
    </div>
  );
}
