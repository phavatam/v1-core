import { createContext, useState, useEffect } from 'react';


interface IUserContext {
  user: any;
  setUser: (user: any) => void;
}

export const UserContext = createContext<IUserContext>({
  user: null,
  setUser: () => {},
});

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null); 
  useEffect(() => {
    async function fetchUserInfo() {
      // const response = await fetch('/api/user-info');
      // const data = await response.json();
      // setUser(data);
      // Giả sử dữ liệu user tĩnh cho ví dụ
      const data = { id: 1, name: 'John Doe', email: 'john.doe@example.com' };
      setUser(data);
      console.log('User info fetched:', data);
    }
    fetchUserInfo();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}