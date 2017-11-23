--
-- ER/Studio Data Architect 8.5 SQL Code Generation
-- Company :      itri
-- Project :      dnn20171031.DM1
-- Author :       c
--
-- Date Created : Monday, October 30, 2017 15:49:37
-- Target DBMS : PostgreSQL 8.0
--

-- 
-- TABLE: admin_user 
--

CREATE TABLE admin_user(
    id    BIGSERIAL,
    CONSTRAINT "PK12" PRIMARY KEY (id)
)
;



-- 
-- TABLE: container 
--

CREATE TABLE container(
    id            BIGSERIAL,
    service_ip    varchar(16),
    pod_ip        varchar(16),
    ssh_port      int4,
    phase         varchar(64),
    message       varchar(64),
    created_at    timestamp,
    updated_at    timestamp,
    CONSTRAINT "PK6" PRIMARY KEY (id)
)
;



-- 
-- TABLE: dnn_user 
--

CREATE TABLE dnn_user(
    id            BIGSERIAL,
    itri_id       varchar(32)    NOT NULL,
    salt          varchar(32),
    created_at    timestamp      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at    timestamp,
    deleted_at    timestamp,
    type_id       int4           NOT NULL,
    CONSTRAINT "PK1" PRIMARY KEY (id)
)
;



-- 
-- TABLE: image 
--

CREATE TABLE image(
    id             BIGSERIAL,
    digest         varchar(64),
    path           varchar(256),
    name           varchar(64),
    label          varchar(64),
    description    varchar(512),
    created_at     timestamp       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at     timestamp,
    deleted_at     timestamp,
    CONSTRAINT "PK8" PRIMARY KEY (id)
)
;



-- 
-- TABLE: machine 
--

CREATE TABLE machine(
    id             BIGSERIAL,
    status_id      int4            NOT NULL,
    name           varchar(64),
    label          varchar(10)     NOT NULL,
    description    varchar(256),
    gpu_amount     int4,
    gpu_type       varchar(64),
    created_at     timestamp       DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at     timestamp,
    deleted_at     timestamp,
    CONSTRAINT "PK2" PRIMARY KEY (id)
)
;



-- 
-- TABLE: machine_status 
--

CREATE TABLE machine_status(
    id        int4           NOT NULL,
    status    varchar(20),
    CONSTRAINT "PK4" PRIMARY KEY (id)
)
;



-- 
-- TABLE: port 
--

CREATE TABLE port(
    id              BIGSERIAL,
    container_id    int8           NOT NULL,
    name            varchar(25),
    protocol        varchar(25),
    port            int4,
    target_port     int4,
    node_port       int4,
    CONSTRAINT "PK17" PRIMARY KEY (id)
)
;



-- 
-- TABLE: project_code 
--

CREATE TABLE project_code(
    id            BIGSERIAL,
    code          varchar(32)    NOT NULL,
    created_at    timestamp      DEFAULT CURRENT_TIMESTAMP,
    updated_at    timestamp,
    deleted_at    timestamp,
    CONSTRAINT "PK15" PRIMARY KEY (id)
)
;



-- 
-- TABLE: report 
--

CREATE TABLE report(
    id             BIGSERIAL,
    description    varchar(256),
    schedule_id    int8,
    user_id        int8,
    created_at     timestamp       NOT NULL,
    updated_at     timestamp,
    deleted_at     timestamp,
    CONSTRAINT "PK18" PRIMARY KEY (id)
)
;



-- 
-- TABLE: schedule 
--

CREATE TABLE schedule(
    id                 BIGSERIAL,
    status_id          int4           NOT NULL,
    username           varchar(32),
    password           varchar(32),
    project_code       varchar(64),
    description        varchar(64),
    started_at         timestamp,
    ended_at           timestamp,
    created_at         timestamp      DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at         timestamp,
    canceled_at        timestamp,
    deleted_at         timestamp,
    expired_at         timestamp,
    user_id            int8           NOT NULL,
    project_code_id    int8,
    image_id           int8           NOT NULL,
    machine_id         int8           NOT NULL,
    CONSTRAINT "PK5" PRIMARY KEY (id)
)
;



-- 
-- TABLE: schedule_status 
--

CREATE TABLE schedule_status(
    id        int4           NOT NULL,
    status    varchar(20),
    CONSTRAINT "PK13" PRIMARY KEY (id)
)
;



-- 
-- TABLE: user_type 
--

CREATE TABLE user_type(
    id      int4           NOT NULL,
    type    varchar(20),
    CONSTRAINT "PK11" PRIMARY KEY (id)
)
;



-- 
-- TABLE: admin_user 
--

ALTER TABLE admin_user ADD CONSTRAINT "Refdnn_user18" 
    FOREIGN KEY (id)
    REFERENCES dnn_user(id)
;


-- 
-- TABLE: container 
--

ALTER TABLE container ADD CONSTRAINT "Refschedule48" 
    FOREIGN KEY (id)
    REFERENCES schedule(id)
;


-- 
-- TABLE: dnn_user 
--

ALTER TABLE dnn_user ADD CONSTRAINT "Refuser_type15" 
    FOREIGN KEY (type_id)
    REFERENCES user_type(id)
;


-- 
-- TABLE: machine 
--

ALTER TABLE machine ADD CONSTRAINT "Refmachine_status2" 
    FOREIGN KEY (status_id)
    REFERENCES machine_status(id)
;


-- 
-- TABLE: port 
--

ALTER TABLE port ADD CONSTRAINT "Refcontainer27" 
    FOREIGN KEY (container_id)
    REFERENCES container(id)
;


-- 
-- TABLE: report 
--

ALTER TABLE report ADD CONSTRAINT "Refdnn_user41" 
    FOREIGN KEY (user_id)
    REFERENCES dnn_user(id)
;

ALTER TABLE report ADD CONSTRAINT "Refschedule40" 
    FOREIGN KEY (schedule_id)
    REFERENCES schedule(id)
;


-- 
-- TABLE: schedule 
--

ALTER TABLE schedule ADD CONSTRAINT "Refmachine47" 
    FOREIGN KEY (machine_id)
    REFERENCES machine(id)
;

ALTER TABLE schedule ADD CONSTRAINT "Refdnn_user19" 
    FOREIGN KEY (user_id)
    REFERENCES dnn_user(id)
;

ALTER TABLE schedule ADD CONSTRAINT "Refproject_code21" 
    FOREIGN KEY (project_code_id)
    REFERENCES project_code(id)
;

ALTER TABLE schedule ADD CONSTRAINT "Refschedule_status23" 
    FOREIGN KEY (status_id)
    REFERENCES schedule_status(id)
;

ALTER TABLE schedule ADD CONSTRAINT "Refimage32" 
    FOREIGN KEY (image_id)
    REFERENCES image(id)
;

INSERT INTO machine_status (id, status) VALUES (1, 'normal');
INSERT INTO machine_status (id, status) VALUES (2, 'error');
INSERT INTO machine_status (id, status) VALUES (3, 'disable');
INSERT INTO machine_status (id, status) VALUES (4, 'destory');

INSERT INTO schedule_status (id, status) VALUES (1, 'waiting');
INSERT INTO schedule_status (id, status) VALUES (2, 'loading');
INSERT INTO schedule_status (id, status) VALUES (3, 'running');
INSERT INTO schedule_status (id, status) VALUES (4, 'deleting');
INSERT INTO schedule_status (id, status) VALUES (5, 'deleted');
INSERT INTO schedule_status (id, status) VALUES (6, 'canceled');
INSERT INTO schedule_status (id, status) VALUES (7, 'error');
INSERT INTO schedule_status (id, status) VALUES (8, 'creating');
INSERT INTO schedule_status (id, status) VALUES (9, 'outdate');
INSERT INTO schedule_status (id, status) VALUES (10, 'remove fail');

INSERT INTO user_type (id, type) VALUES (1, 'normal');
INSERT INTO user_type (id, type) VALUES (2, 'admin');



