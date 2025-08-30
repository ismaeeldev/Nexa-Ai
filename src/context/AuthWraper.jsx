"use client";

import AuthProvider from "./AuthProvider";

export default function AuthProviderWrapper({
    children,
    session,
}) {
    return <AuthProvider initialUser={session.user}>{children}</AuthProvider>;
}
