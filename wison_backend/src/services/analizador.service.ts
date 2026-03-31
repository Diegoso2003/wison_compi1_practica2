let users: any[] = [];

export const getAll = () => {
  return users;
};

export const create = (data: any) => {
  const { nombre, edad } = data;

  if (!nombre || !edad) {
    throw {
      status: 400,
      message: "Nombre y edad son obligatorios"
    };
  }

  if (edad < 0) {
    throw {
      status: 400,
      message: "Edad inválida"
    };
  }

  const newUser = {
    id: users.length + 1,
    nombre,
    edad
  };

  users.push(newUser);

  return newUser;
};