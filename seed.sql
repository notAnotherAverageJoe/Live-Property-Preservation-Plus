INSERT INTO Companies (name, address)
VALUES ('Example Company', '123 Example St');

INSERT INTO Users (company_id, first_name, last_name, email, password_hash)
VALUES (1, 'John', 'Doe', 'john.doe@example.com', 'hashedpassword123'),
       (1, 'Jane', 'Smith', 'jane.smith@example.com', 'hashedpassword456');


INSERT INTO financialtransactions (property_id, type, amount, description, transaction_date)
VALUES
(52, 'Income', 1500.00, 'Rent payment for August', '2024-08-01'),
(52, 'Expense', 200.00, 'Maintenance for plumbing', '2024-08-05'),
(52, 'Income', 1500.00, 'Rent payment for September', '2024-09-01'),
(52, 'Expense', 100.00, 'Cleaning services', '2024-09-10');
