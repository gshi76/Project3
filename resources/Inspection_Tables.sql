CREATE TABLE "chains" (
    "chain_license_number" int NOT NULL,
    "facility_type" varchar(20),
    "DBA_Name" varchar(20)
);

CREATE TABLE "inspection" (
    "inspection_id" int NOT NULL,
    "DBA_Name" varchar(20) NOT NULL,
    "inspection_type" varchar(40) NOT NULL, 
    "inspection_results" varchar(20) NOT NULL, 
    "inspection_date" date NOT NULL, 
    "violations" varchar(400),

    CONSTRAINT "pk_inspection" PRIMARY KEY ("inspection_id")
);

CREATE TABLE "facility_demographics" (
    "DBA_Name" varchar(20) NOT NULL,
    "facility_type" varchar(20) NOT NULL,
    "risk" varchar(20) NOT NULL, 
    "lat_long" varchar(200) NOT NULL   
);

CREATE TABLE "chain_location" (
    "address" varchar(100) NOT NULL,
    "city" char(15) NOT NULL,
    "state" varchar(20) NOT NULL,
    "ID" int NOT NULL,
    "lat" numeric(15, 10) NOT NULL, 
    "lon" numeric(15, 10) NOT NULL, 
    "DBA_Name" varchar(20) NOT NULL,
    CONSTRAINT "pk_chain_location" PRIMARY KEY ("ID")
);

