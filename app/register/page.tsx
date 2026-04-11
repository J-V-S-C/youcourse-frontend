import RegisterForm from "../components/RegisterForm";

export const metadata = {
  title: "Register - Youcourse",
  description: "Register a new account",
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-8">Sign In</h2>
        <RegisterForm />
      </div>
    </div>
  );
}
