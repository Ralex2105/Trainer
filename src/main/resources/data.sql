
insert into roles (id, name) values(1, 'admin'),
(2, 'teacher'),
(3, 'student');

insert into users (id, enabled, name, email, password, role_id) values
(1, true, 'test',	'admin@mail.ru',	'$2y$10$OKb7kzsaYkof4.QlBPa3z.X2Eb5vCmKh3..wlJkWkIFzCLxpM.20i',	1),
(2, true, 'student',	'student@mail.ru',	'$2y$10$aJjwQl2r42807ikXWTQ5d.NJu7AhyCx3xOa23hS97f6rjXlTGYOsG',	3),
(3,	true,'teacher',	'teacher@mail.ru',	'$2y$10$aJjwQl2r42807ikXWTQ5d.NJu7AhyCx3xOa23hS97f6rjXlTGYOsG',	2);

insert into categories (id, name, type) values
(1, 'Экспорт', 0),
(2, 'Импорт', 0),
(3, 'Транзит', 0),
(4,'Декларант', 1),
(5,'Таможенник', 1),
(6,'Перевозчик', 1),
(7,'Водный', 2),
(8,'Воздушный', 2),
(9,'Наземный', 2),
(10,'Смешанный', 2);