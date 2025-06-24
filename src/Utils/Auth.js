export const isAuthenticated = () => {
    return !!localStorage.getItem("token");
    // return true
};
