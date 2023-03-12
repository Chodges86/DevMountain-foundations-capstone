-- COPY THIS INTO bit.io 
DROP TABLE current_list;
DROP TABLE recent_delete;

CREATE TABLE current_list(
    id SERIAL PRIMARY KEY,
    description VARCHAR(255),
    url VARCHAR,
    is_purchased BOOLEAN
    );

CREATE TABLE recent_delete(
    id INTEGER,
    description VARCHAR(255),
    url VARCHAR,
    is_purchased BOOLEAN
);

INSERT INTO current_list (description, url, is_purchased)
VALUES ('Boat Paddle', 'https://www.amazon.com/dp/B003DK3GSC?pd_rd_i=B003DK3GSC&pf_rd_p=b000e0a0-9e93-480f-bf78-a83c8136dfcb&pf_rd_r=TR0KMTE31HSZHZVY74JM&pd_rd_wg=aRWkM&pd_rd_w=TyecS&pd_rd_r=99b43dcd-81d6-458d-a34a-bd4cd7a2cb99', false),
('Boat Trailer Tail lights', 'https://www.academy.com/p/optronics%C2%AE-truck-and-trailer-light-set', false),
('Record Player', 'https://www.amazon.com/Bluetooth-Belt-Driven-Turntable-Speakers-Headphone/dp/B07N3WYLKZ/ref=sr_1_3?crid=9X50KD1X1FSV&keywords=record+player&qid=1677955516&sprefix=record+player%2Caps%2C129&sr=8-3', false),
('Golden Retriever', 'https://puppies.com/find-a-puppy/golden-retriever/mississippi/hernando', false),
('3 wheeler light bulb', 'https://www.amazon.com/HELLA-A3603-Miniature-Standard-Bulb/dp/B00IKLOL4C/ref=asc_df_B00IKLOL4C/?tag=hyprod-20&linkCode=df0&hvadid=607186602417&hvpos=&hvnetw=g&hvrand=12687694965586222905&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9013733&hvtargid=pla-1710460508625&th=1', false),
('Camper jack stand', 'https://www.amazon.com/BAL-23025-Tent-Trailer-Stabilizer/dp/B000GGMSQM/ref=sr_1_4?crid=LUDM9WR1GW6C&keywords=coleman+pop+up+camper+jack+stand&qid=1677956063&sprefix=coleman+pop+up+camper+jack+stand%2Caps%2C149&sr=8-4&ufe=app_do%3Aamzn1.fos.006c50ae-5d4c-4777-9bc0-4513d670b6bc', false);

SELECT * FROM current_list;
SELECT * FROM recent_delete;