import AuthContext from "./AuthContext";

export default function AccountLayout({ children }) {
  return (
    <AuthContext>
      {children}
    </AuthContext>
  );
}
