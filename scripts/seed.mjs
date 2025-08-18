import mysql from 'mysql2/promise';

async function seedDatabase(connection) {
  try {
    // Create Servicios table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Servicios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL UNIQUE,
        descripcion TEXT,
        duracion INT NOT NULL, -- in minutes
        precio DECIMAL(10, 2) NOT NULL
      );
    `);
    console.log(`Created "Servicios" table`);

    // Create Clientes table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_completo VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        whatsapp VARCHAR(20)
      );
    `);
    console.log(`Created "Clientes" table`);

    // Create Reservas table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS Reservas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT NOT NULL,
        servicio_id INT NOT NULL,
        fecha_hora DATETIME NOT NULL,
        token_reserva VARCHAR(6) NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES Clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (servicio_id) REFERENCES Servicios(id) ON DELETE RESTRICT
      );
    `);
    console.log(`Created "Reservas" table`);

    // Seed services
    const services = [
      { nombre: 'Corte de Cabello', descripcion: 'Estilo clásico o moderno, asesoramiento incluido.', duracion: 30, precio: 25.00 },
      { nombre: 'Afeitado Clásico', descripcion: 'Ritual de afeitado con navaja, toallas calientes y productos de primera calidad.', duracion: 45, precio: 30.00 },
      { nombre: 'Arreglo de Barba', descripcion: 'Diseño, perfilado y cuidado de tu barba para un look definido.', duracion: 20, precio: 15.00 },
    ];
    
    for (const service of services) {
        await connection.execute(
            `INSERT IGNORE INTO Servicios (nombre, descripcion, duracion, precio) VALUES (?, ?, ?, ?)`,
            [service.nombre, service.descripcion, service.duracion, service.precio]
        );
    }
    console.log(`Seeded services.`);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });

  await seedDatabase(connection);
  
  await connection.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
