import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const UserProfileContext = createContext(null);

const STORAGE_KEY = 'khemet-user-profile';

const defaultUser = {
  name: 'KHEMET Guest',
  email: '',
  avatar: '',
  isDefault: true,
};

export function UserProfileProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (!savedUser) {
      return defaultUser;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    if (user?.isDefault) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  const updateAvatar = (file) => {
    const reader = new FileReader();

    reader.onload = () => {
      setUser((prev) => ({
        ...prev,
        avatar: reader.result,
      }));

      /*
        Backend later:

        const formData = new FormData();
        formData.append('avatar', file);

        PATCH /users/me/avatar
      */
    };

    reader.readAsDataURL(file);
  };

  const updateProfile = (nextProfile) => {
    setUser((prev) => ({
      ...prev,

      /*
        الاسم فقط هو اللي بيتعدل
      */

      name: nextProfile.name ?? prev.name,
      isDefault: false,

      /*
        الإيميل ممنوع يتعدل من الفرونت
        وهيفضل جاي من الباك
      */

      email: prev.email,
    }));

    /*
      Backend later:

      PATCH /users/me
      body:
      {
        name: nextProfile.name
      }
    */
  };

  const setUserFromBackend = (backendUser) => {
    setUser({
      name: backendUser.name,
      email: backendUser.email,
      avatar: backendUser.avatar || '',
      isDefault: false,
    });

    /*
      تستخدم بعد login/signup
    */
  };

  const clearUser = () => {
    setUser(defaultUser);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      updateAvatar,
      updateProfile,
      setUserFromBackend,
      clearUser,
    }),
    [user]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);

  if (!context) {
    throw new Error(
      'useUserProfile must be used inside UserProfileProvider'
    );
  }

  return context;
}
