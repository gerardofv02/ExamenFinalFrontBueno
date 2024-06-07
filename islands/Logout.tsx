const Logout = () => {
  const onlogout = () => {
    document.cookie = 'auth=; path="/"';
    document.location = "/login";
  };

  return (
    <button
      class="logout-button"
      onClick={() => {
        onlogout();
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
