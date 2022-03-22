--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: characters; Type: TABLE; Schema: public; Owner: <current user>
--

CREATE TABLE public.characters (
    _id integer NOT NULL,
    name character varying NOT NULL,
    home_planet_id integer NOT NULL
);

--
-- Name: characters__id_seq; Type: SEQUENCE; Schema: public; Owner: <current user>
--

CREATE SEQUENCE public.characters__id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: characters__id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: <current user>
--

ALTER SEQUENCE public.characters__id_seq OWNED BY public.characters._id;


--
-- Name: planets; Type: TABLE; Schema: public; Owner: <current user>
--

CREATE TABLE public.planets (
    _id integer NOT NULL,
    name character varying NOT NULL
);

--
-- Name: characters _id; Type: DEFAULT; Schema: public; Owner: <current user>
--

ALTER TABLE ONLY public.characters ALTER COLUMN _id SET DEFAULT nextval('public.characters__id_seq'::regclass);


--
-- Data for Name: characters; Type: TABLE DATA; Schema: public; Owner: <current user>
--

COPY public.characters (_id, name, home_planet_id) FROM stdin;
1	Luke Skywalker	1
2	Anakin Skywalker	56
3	Yoda Smith	532
4	R2D2	5542
5	Chewbacca	532
\.


--
-- Data for Name: planets; Type: TABLE DATA; Schema: public; Owner: <current user>
--

COPY public.planets (_id, name) FROM stdin;
1	Tatooine
56	Coruscant
532	Dagobah
5542	Naboo
\.


--
-- Name: characters__id_seq; Type: SEQUENCE SET; Schema: public; Owner: <current user>
--

SELECT pg_catalog.setval('public.characters__id_seq', 6, true);


--
-- Name: characters characters_pkey; Type: CONSTRAINT; Schema: public; Owner: <current user>
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT characters_pkey PRIMARY KEY (_id);


--
-- Name: planets planets_pkey; Type: CONSTRAINT; Schema: public; Owner: <current user>
--

ALTER TABLE ONLY public.planets
    ADD CONSTRAINT planets_pkey PRIMARY KEY (_id);


--
-- Name: characters constraint_fk; Type: FK CONSTRAINT; Schema: public; Owner: <current user>
--

ALTER TABLE ONLY public.characters
    ADD CONSTRAINT constraint_fk FOREIGN KEY (home_planet_id) REFERENCES public.planets(_id);


--
-- PostgreSQL database dump complete
--

