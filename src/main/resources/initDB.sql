
--CREATE TABLE IF NOT EXISTS trainer.answers
--(
--    answer_id integer NOT NULL,
--    answer text
--);
--
----CREATE FUNCTION IF NOT EXISTS trainer.answer_to_test(integer) RETURNS SETOF trainer.answers
----    LANGUAGE plpgsql
----    AS $_$
----begin
----	return query select a.answer_id as "ID",
----	a.answer as "Ответ"
----	from trainer.answers a where a.answer_id in
----	(
----		select answer_id from trainer.task_have_answer tha
----		where tha.task_id = $1 and tha.is_correct = true
----	);
----end;
----$_$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.delete_answer(IN id integer)
----    LANGUAGE plpgsql
----    AS $$declare any_child int:= count(*) from trainer.task_have_answer
----	where answer_id = id;
----begin
----	if (any_child > 0) then
----		raise notice 'Ответ используется в заданиях, его нельзя удалить';
----	else
----		delete from trainer.answers where answer_id = id;
----	end if;
----end;$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.delete_task(IN id integer)
----    LANGUAGE plpgsql
----    AS $$declare any_child int:= count(*) from trainer.task_have_answer
----where task_id = id;
----begin
----	if(any_child > 0) then
----		raise notice 'Нельзя удалить задание, оно связано с ответами';
----	else
----		delete from trainer.tasks where task_id = id;
----	end if;
----end;
----	$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.delete_user(IN id integer)
----    LANGUAGE sql
----    AS $$delete from trainer.users where user_id = id$$;
----
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.insert_answer(IN answer text)
----    LANGUAGE sql
----    AS $$insert into trainer.answers(answer) values(answer)$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.insert_task(IN description text, IN category integer, IN link text, IN image text)
----    LANGUAGE plpgsql
----    AS $$
----begin
----insert into trainer.tasks(description, category, link, image) values(description, category, link, image);
----end;
----$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.insert_user(IN name text, IN login text, IN password text, IN role text)
----    LANGUAGE sql
----    AS $$insert into trainer.users(name,login,password,role) values(name, login, password, role)$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.update_answer(IN new_answer text, IN id integer)
----    LANGUAGE sql
----    AS $$update trainer.answers set answer = new_answer where answer_id = id$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.update_task(IN new_desc text, IN new_category integer, IN new_link text, IN new_image text, IN id integer)
----    LANGUAGE sql
----    AS $$update trainer.tasks
----set description = new_desc,
----category = new_category,
----link = new_link,
----image = new_image
----where task_id = id$$;
----
----
----CREATE PROCEDURE IF NOT EXISTS trainer.update_user(IN new_name text, IN new_login text, IN new_password text, IN new_role text, IN id integer)
----    LANGUAGE sql
----    AS $$update trainer.users set name = new_name,
----login = new_login, password = new_password,
----role = new_role where user_id = id$$;
----
----
----CREATE VIEW IF NOT EXISTS trainer.answer_task AS
---- SELECT answers.answer_id AS "ID",
----    answers.answer AS "Ответ"
----   FROM trainer.answers;
--
--
--ALTER TABLE IF NOT EXISTS trainer.answers ALTER COLUMN answer_id ADD GENERATED ALWAYS AS IDENTITY (
--    SEQUENCE NAME trainer.answers_answer_id_seq
--    START WITH 1
--    INCREMENT BY 1
--    NO MINVALUE
--    NO MAXVALUE
--    CACHE 1
--);
--
--
--CREATE TABLE IF NOT EXISTS trainer.task_have_answer (
--    task_answer_id integer NOT NULL,
--    task_id integer NOT NULL,
--    answer_id integer NOT NULL,
--    is_correct boolean DEFAULT false NOT NULL
--);
--
--
--
--ALTER TABLE IF NOT EXISTS trainer.task_have_answer ALTER COLUMN task_answer_id ADD GENERATED ALWAYS AS IDENTITY (
--    SEQUENCE NAME trainer.task_have_answer_task_answer_id_seq
--    START WITH 1
--    INCREMENT BY 1
--    NO MINVALUE
--    NO MAXVALUE
--    CACHE 1
--);
--
--

CREATE TABLE IF NOT EXISTS tasks (
    task_id integer NOT NULL,
    description text NOT NULL,
    category integer NOT NULL,
    link text NOT NULL,
    image text NOT NULL
);
--
--
--CREATE VIEW IF NOT EXISTS trainer.task_view AS
-- SELECT tasks.task_id AS "ID",
--    tasks.description AS "Описание",
--    tasks.category AS "Категория теста",
--    tasks.image AS "Изображение",
--    tasks.link AS "Ссылка на карточку"
--   FROM trainer.tasks;
--
--
--ALTER TABLE IF NOT EXISTS trainer.tasks ALTER COLUMN task_id ADD GENERATED ALWAYS AS IDENTITY (
--    SEQUENCE NAME trainer.tasks_task_id_seq
--    START WITH 1
--    INCREMENT BY 1
--    NO MINVALUE
--    NO MAXVALUE
--    CACHE 1
--);
--
--CREATE TABLE IF NOT EXISTS trainer.users (
--    user_id integer NOT NULL,
--    name text NOT NULL,
--    login text NOT NULL,
--    password text NOT NULL,
--    role text NOT NULL
--);
--
--
--
--CREATE VIEW IF NOT EXISTS trainer.user_view AS
-- SELECT users.user_id AS id,
--    users.name AS "Имя",
--    users.login AS "Логин",
--    users.password AS "Пароль",
--    users.role AS "Роль"
--   FROM trainer.users;
--
--ALTER TABLE IF NOT EXISTS trainer.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
--    SEQUENCE NAME trainer.users_user_id_seq
--    START WITH 1
--    INCREMENT BY 1
--    NO MINVALUE
--    NO MAXVALUE
--    CACHE 1
--);
--
--
--
--
--
----
---- TOC entry 3391 (class 0 OID 0)
---- Dependencies: 221
---- Name: answers_answer_id_seq; Type: SEQUENCE SET; Schema: trainer; Owner: -
----
--
--SELECT pg_catalog.setval('trainer.answers_answer_id_seq', 2, true);
--
--
----
---- TOC entry 3392 (class 0 OID 0)
---- Dependencies: 222
---- Name: task_have_answer_task_answer_id_seq; Type: SEQUENCE SET; Schema: trainer; Owner: -
----
--
--SELECT pg_catalog.setval('trainer.task_have_answer_task_answer_id_seq', 2, true);
--
--
----
---- TOC entry 3393 (class 0 OID 0)
---- Dependencies: 223
---- Name: tasks_task_id_seq; Type: SEQUENCE SET; Schema: trainer; Owner: -
----
--
--SELECT pg_catalog.setval('trainer.tasks_task_id_seq', 2, true);
--
--SELECT pg_catalog.setval('trainer.users_user_id_seq', 5, true);
--
--
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.answers
--    ADD CONSTRAINT answers_pkey PRIMARY KEY (answer_id);
--
--
--ALTER TABLE IF NOT EXISTS trainer.users
--    ADD CONSTRAINT login_ch CHECK ((length(login) > 5)) NOT VALID;
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.users
--    ADD CONSTRAINT login_uq UNIQUE (login);
--
--
--ALTER TABLE IF NOT EXISTS trainer.users
--    ADD CONSTRAINT password_ch CHECK ((length(password) > 5)) NOT VALID;
--
--ALTER TABLE IF NOT EXISTS trainer.users
--    ADD CONSTRAINT role_ch CHECK (((role = 'student'::text) OR (role = 'administrator'::text) OR (role = 'teacher'::text))) NOT VALID;
--
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.task_have_answer
--    ADD CONSTRAINT task_have_answer_pkey PRIMARY KEY (task_answer_id);
--
--
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.tasks
--    ADD CONSTRAINT task_pkey PRIMARY KEY (task_id);
--
--
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.users
--    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.task_have_answer
--    ADD CONSTRAINT answer_id_fk FOREIGN KEY (answer_id) REFERENCES trainer.answers(answer_id);
--
--
--ALTER TABLE IF NOT EXISTS ONLY trainer.task_have_answer
--    ADD CONSTRAINT task_id_fk FOREIGN KEY (task_id) REFERENCES trainer.tasks(task_id);
--
--
--GRANT USAGE ON SCHEMA trainer TO student;
--GRANT USAGE ON SCHEMA trainer TO administrator;
--GRANT USAGE ON SCHEMA trainer TO teacher;
--
--
--GRANT ALL ON TABLE IF NOT EXISTS trainer.answers TO administrator;
--GRANT SELECT ON TABLE IF NOT EXISTS trainer.answers TO student;
--GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE IF NOT EXISTS trainer.answers TO teacher;
--
--
----
---- TOC entry 3388 (class 0 OID 0)
---- Dependencies: 218
---- Name: TABLE IF NOT EXISTS task_have_answer; Type: ACL; Schema: trainer; Owner: -
----
--
--GRANT ALL ON TABLE IF NOT EXISTS trainer.task_have_answer TO administrator;
--GRANT SELECT ON TABLE IF NOT EXISTS trainer.task_have_answer TO student;
--GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE IF NOT EXISTS trainer.task_have_answer TO teacher;
--
--
----
---- TOC entry 3389 (class 0 OID 0)
---- Dependencies: 216
---- Name: TABLE IF NOT EXISTS tasks; Type: ACL; Schema: trainer; Owner: -
----
--
--GRANT SELECT ON TABLE IF NOT EXISTS trainer.tasks TO student;
--GRANT ALL ON TABLE IF NOT EXISTS trainer.tasks TO administrator;
--GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE IF NOT EXISTS trainer.tasks TO teacher;
--
--
----
---- TOC entry 3390 (class 0 OID 0)
---- Dependencies: 215
---- Name: TABLE IF NOT EXISTS users; Type: ACL; Schema: trainer; Owner: -
----
--
--GRANT ALL ON TABLE IF NOT EXISTS trainer.users TO administrator;
--GRANT SELECT ON TABLE IF NOT EXISTS trainer.users TO student;
--GRANT SELECT ON TABLE IF NOT EXISTS trainer.users TO teacher;
--
--
----
---- TOC entry 2073 (class 826 OID 49301)
---- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: trainer; Owner: -
----
--
--ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA trainer GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO teacher WITH GRANT OPTION;
--ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA trainer GRANT ALL ON TABLES  TO administrator WITH GRANT OPTION;
--ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA trainer GRANT SELECT ON TABLES  TO student WITH GRANT OPTION;
--
--
---- Completed on 2023-05-05 16:07:01
--
----
---- PostgreSQL database dump complete
----
--
