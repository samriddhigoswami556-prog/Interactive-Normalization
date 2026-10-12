// simulationData.js
// Rich interactive datasets and relational schema progressions
// demonstrating Normal Form violations (UNF -> 1NF -> 2NF -> 3NF -> BCNF)
// with live anomaly test triggers, SQL schemas, and academic diagnostics.

export const SIMULATION_SCENARIOS = [
  {
    id: 'university',
    name: '🎓 University Student & Course Registry',
    shortName: 'University Registry',
    description: 'Tracks students, their departments, HODs, enrolled courses, instructors, and final grades.',
    analyzerAttributes: 'StudentID, StudentName, DeptID, DeptHOD, CourseID, CourseName, Instructor, Grade',
    analyzerFDs: 'StudentID -> StudentName, DeptID\nDeptID -> DeptHOD\nCourseID -> CourseName, Instructor\nStudentID, CourseID -> Grade',
    stages: [
      {
        stageIndex: 0,
        id: 'UNF',
        name: 'UNF (Unnormalized Form)',
        badge: 'ALL NFs VIOLATED',
        badgeColor: 'danger',
        summary: 'Contains non-atomic/multi-valued attributes, partial dependencies, and transitive dependencies in a single unnormalized spreadsheet table.',
        nfStatus: {
          '1NF': { passed: false, reason: 'Cells in Courses, Instructors, and Grades contain multiple values (non-atomic domain).' },
          '2NF': { passed: false, reason: 'Composite key (StudentID, CourseID) has partial dependencies: StudentName, Dept depend only on StudentID.' },
          '3NF': { passed: false, reason: 'Transitive dependency exists: StudentID -> Department -> DeptHOD.' },
          'BCNF': { passed: false, reason: 'Determinants Department and CourseID are not superkeys.' }
        },
        violations: [
          { type: '1NF', label: 'Non-Atomic Multi-Valued Attributes', details: 'Columns "Courses", "Instructors", and "Grades" store comma-separated lists instead of single atomic values.' },
          { type: '2NF', label: 'Partial Dependencies on Composite Key', details: 'Candidate Key is (StudentID, CourseID). Student info depends only on StudentID, Course info depends only on CourseID.' },
          { type: '3NF', label: 'Transitive Dependency (X → Y → Z)', details: 'Department is non-prime, yet determines DeptHOD (also non-prime): StudentID → Department → DeptHOD.' }
        ],
        tables: [
          {
            title: 'R_UNF: Student_Course_Registry',
            primaryKey: ['StudentID', 'Courses'],
            isComposite: true,
            columns: [
              { key: 'studentId', label: 'StudentID', isPK: true, role: 'key-part' },
              { key: 'studentName', label: 'StudentName', isPartial: true },
              { key: 'department', label: 'Department', isPartial: true, isTransitiveDet: true },
              { key: 'deptHod', label: 'DeptHOD', isPartial: true, isTransitiveTarget: true },
              { key: 'courses', label: 'Courses', isMulti: true, isPK: true, role: 'key-part' },
              { key: 'instructors', label: 'Instructors', isMulti: true },
              { key: 'grades', label: 'Grades', isMulti: true }
            ],
            rows: [
              {
                id: 1,
                studentId: 'S101',
                studentName: 'Alice Johnson',
                department: 'Computer Science',
                deptHod: 'Dr. Alan Turing',
                courses: ['CS101 (Intro CS)', 'MATH201 (Calculus)'],
                instructors: ['Prof. Ritchie', 'Prof. Gauss'],
                grades: ['A', 'B+'],
                highlight: true
              },
              {
                id: 2,
                studentId: 'S102',
                studentName: 'Bob Miller',
                department: 'Computer Science',
                deptHod: 'Dr. Alan Turing',
                courses: ['CS101 (Intro CS)', 'CS102 (Data Struct)'],
                instructors: ['Prof. Ritchie', 'Dr. Knuth'],
                grades: ['B', 'A'],
                highlight: false
              },
              {
                id: 3,
                studentId: 'S103',
                studentName: 'Charlie Evans',
                department: 'Electrical Eng',
                deptHod: 'Dr. Maxwell',
                courses: ['EE101 (Circuits)'],
                instructors: ['Prof. Tesla'],
                grades: ['A-'],
                highlight: true
              },
              {
                id: 4,
                studentId: 'S104',
                studentName: 'Diana Prince',
                department: 'Computer Science',
                deptHod: 'Dr. Alan Turing',
                courses: ['MATH201 (Calculus)'],
                instructors: ['Prof. Gauss'],
                grades: ['A'],
                highlight: false
              }
            ]
          }
        ],
        transformationRule: 'Initial State. Every database normal form is currently violated.',
        nextActionText: 'Solve 1NF: Flatten Multi-Valued Cells into Atomic Rows',
        anomalies: {
          insertion: {
            title: 'Insertion Anomaly in UNF',
            severity: 'critical',
            scenario: 'Add a new Department ("Mechanical Engineering", HOD: "Dr. Carnot") before any students enroll.',
            outcome: '❌ IMPOSSIBLE: StudentID is primary key. To store the new department, StudentID would have to be NULL, violating Entity Integrity (Primary Key cannot be NULL).'
          },
          update: {
            title: 'Update Anomaly in UNF',
            severity: 'high',
            scenario: 'The HOD of "Computer Science" changes from Dr. Alan Turing to Dr. Grace Hopper.',
            outcome: '⚠️ INCONSISTENCY RISK: Dr. Alan Turing appears inside multiple rows (Alice, Bob, Diana). If the system updates Alice and Bob but crashes before Diana, two conflicting HODs will exist for Computer Science!'
          },
          deletion: {
            title: 'Deletion Anomaly in UNF',
            severity: 'critical',
            scenario: 'Charlie Evans (S103) drops out or graduates.',
            outcome: '❌ CATASTROPHIC DATA LOSS: Deleting Charlie\'s row completely deletes the "Electrical Eng" department and HOD "Dr. Maxwell" from the database, because no other student is enrolled in EE!'
          }
        },
        sqlDDL: `-- UNF Table: Violates 1NF (Relational DBMS cannot even store array/repeating groups cleanly without non-standard types)
CREATE TABLE Student_Course_Registry_UNF (
    StudentID VARCHAR(10),
    StudentName VARCHAR(100),
    Department VARCHAR(50),
    DeptHOD VARCHAR(100),
    Courses TEXT,       -- VIOLATION: Non-atomic comma-separated values
    Instructors TEXT,   -- VIOLATION: Non-atomic comma-separated values
    Grades TEXT         -- VIOLATION: Non-atomic comma-separated values
);`
      },
      {
        stageIndex: 1,
        id: '1NF',
        name: '1NF (First Normal Form)',
        badge: 'ATOMICITY ENFORCED',
        badgeColor: 'warning',
        summary: 'All values are now single atomic values. However, massive redundant duplicates appear, and 2NF (partial dependencies) and 3NF (transitive dependencies) are violated!',
        nfStatus: {
          '1NF': { passed: true, reason: 'Every cell contains exactly one atomic value. Each record is distinct.' },
          '2NF': { passed: false, reason: 'Candidate key is (StudentID, CourseID). Partial dependencies exist: StudentID -> StudentName, Dept, HOD and CourseID -> CourseName, Instructor.' },
          '3NF': { passed: false, reason: 'Department -> DeptHOD is a transitive dependency between non-prime attributes.' },
          'BCNF': { passed: false, reason: 'Determinants StudentID, CourseID, and Department are not superkeys in this combined relation.' }
        },
        violations: [
          { type: '2NF', label: 'Partial Dependency: StudentID → (StudentName, Department, DeptHOD)', details: 'Student info depends solely on StudentID, which is a proper subset of the composite candidate key {StudentID, CourseID}.' },
          { type: '2NF', label: 'Partial Dependency: CourseID → (CourseName, Instructor)', details: 'Course info depends solely on CourseID, which is a proper subset of {StudentID, CourseID}.' },
          { type: '3NF', label: 'Transitive Dependency: Department → DeptHOD', details: 'Non-prime attribute Department determines non-prime attribute DeptHOD (X → Y → Z where neither is superkey).' }
        ],
        tables: [
          {
            title: 'R_1NF: Student_Enrollment_Atomic',
            primaryKey: ['StudentID', 'CourseID'],
            isComposite: true,
            columns: [
              { key: 'studentId', label: 'StudentID', isPK: true, role: 'key-part' },
              { key: 'studentName', label: 'StudentName', isPartial: true },
              { key: 'department', label: 'Department', isPartial: true, isTransitiveDet: true },
              { key: 'deptHod', label: 'DeptHOD', isPartial: true, isTransitiveTarget: true },
              { key: 'courseId', label: 'CourseID', isPK: true, role: 'key-part' },
              { key: 'courseName', label: 'CourseName', isPartial: true },
              { key: 'instructor', label: 'Instructor', isPartial: true },
              { key: 'grade', label: 'Grade', isFullDep: true }
            ],
            rows: [
              { id: 1, studentId: 'S101', studentName: 'Alice Johnson', department: 'CS', deptHod: 'Dr. Turing', courseId: 'CS101', courseName: 'Intro CS', instructor: 'Prof. Ritchie', grade: 'A', isDuplicateGroup: 'A' },
              { id: 2, studentId: 'S101', studentName: 'Alice Johnson', department: 'CS', deptHod: 'Dr. Turing', courseId: 'MATH201', courseName: 'Calculus', instructor: 'Prof. Gauss', grade: 'B+', isDuplicateGroup: 'A' },
              { id: 3, studentId: 'S102', studentName: 'Bob Miller', department: 'CS', deptHod: 'Dr. Turing', courseId: 'CS101', courseName: 'Intro CS', instructor: 'Prof. Ritchie', grade: 'B', isDuplicateGroup: 'B' },
              { id: 4, studentId: 'S102', studentName: 'Bob Miller', department: 'CS', deptHod: 'Dr. Turing', courseId: 'CS102', courseName: 'Data Struct', instructor: 'Dr. Knuth', grade: 'A', isDuplicateGroup: 'B' },
              { id: 5, studentId: 'S103', studentName: 'Charlie Evans', department: 'EE', deptHod: 'Dr. Maxwell', courseId: 'EE101', courseName: 'Circuits', instructor: 'Prof. Tesla', grade: 'A-', isDuplicateGroup: 'C' },
              { id: 6, studentId: 'S104', studentName: 'Diana Prince', department: 'CS', deptHod: 'Dr. Turing', courseId: 'MATH201', courseName: 'Calculus', instructor: 'Prof. Gauss', grade: 'A', isDuplicateGroup: 'D' }
            ]
          }
        ],
        transformationRule: 'Flattened multi-valued arrays into atomic records. Notice the duplicate student and course rows highlighted!',
        nextActionText: 'Solve 2NF: Decompose to Eliminate Partial Dependencies',
        anomalies: {
          insertion: {
            title: 'Insertion Anomaly in 1NF',
            severity: 'critical',
            scenario: 'Offer a brand new course ("CS301: Algorithms", Instructor: "Dr. Cormen") before any student registers.',
            outcome: '❌ IMPOSSIBLE: CourseID is part of composite primary key (StudentID, CourseID). Since no student is registered, StudentID is NULL, violating Primary Key constraints!'
          },
          update: {
            title: 'Update Anomaly in 1NF',
            severity: 'high',
            scenario: 'Intro to CS instructor changes from "Prof. Ritchie" to "Prof. Stroustrup".',
            outcome: '⚠️ REDUNDANCY OVERHEAD: Appears in Row 1 (Alice) and Row 3 (Bob). Updating only Row 1 creates inconsistent records for the exact same course!'
          },
          deletion: {
            title: 'Deletion Anomaly in 1NF',
            severity: 'critical',
            scenario: 'Charlie Evans (S103) withdraws from EE101.',
            outcome: '❌ DATA DELETED: Deleting Row 5 wipes out the entire record of EE101, Circuits, Prof. Tesla, and the Electrical Engineering Department!'
          }
        },
        sqlDDL: `-- 1NF Table: Atomic attributes, but composite primary key with partial dependencies
CREATE TABLE Student_Enrollment_1NF (
    StudentID VARCHAR(10) NOT NULL,
    CourseID VARCHAR(10) NOT NULL,
    StudentName VARCHAR(100),
    Department VARCHAR(50),
    DeptHOD VARCHAR(100),
    CourseName VARCHAR(100),
    Instructor VARCHAR(100),
    Grade VARCHAR(5),
    PRIMARY KEY (StudentID, CourseID)
);
-- 2NF Violation: StudentName, Dept depend only on StudentID (partial dependency!)`
      },
      {
        stageIndex: 2,
        id: '2NF',
        name: '2NF (Second Normal Form)',
        badge: 'PARTIAL DEPENDENCIES REMOVED',
        badgeColor: 'info',
        summary: 'Decomposed into 3 separate tables. Every non-prime attribute is fully dependent on its table\'s primary key. But 3NF is still violated due to transitive dependency in Students!',
        nfStatus: {
          '1NF': { passed: true, reason: 'All attributes remain strictly atomic.' },
          '2NF': { passed: true, reason: 'All partial dependencies removed! Non-prime attributes depend on the full candidate key in each table.' },
          '3NF': { passed: false, reason: 'Table Students has transitive dependency: StudentID -> Department and Department -> DeptHOD.' },
          'BCNF': { passed: false, reason: 'Department in Students table is a determinant but not a candidate key.' }
        },
        violations: [
          { type: '3NF', label: 'Transitive Dependency in Students: Department → DeptHOD', details: 'In Students table, StudentID determines Department, and Department determines DeptHOD. Neither is a candidate key.' }
        ],
        tables: [
          {
            title: 'Table 1: Students (Partial Dependency Removed)',
            primaryKey: ['StudentID'],
            isComposite: false,
            columns: [
              { key: 'studentId', label: 'StudentID', isPK: true },
              { key: 'studentName', label: 'StudentName' },
              { key: 'department', label: 'Department', isTransitiveDet: true },
              { key: 'deptHod', label: 'DeptHOD', isTransitiveTarget: true }
            ],
            rows: [
              { id: 1, studentId: 'S101', studentName: 'Alice Johnson', department: 'CS', deptHod: 'Dr. Turing', highlightTransitive: true },
              { id: 2, studentId: 'S102', studentName: 'Bob Miller', department: 'CS', deptHod: 'Dr. Turing', highlightTransitive: true },
              { id: 3, studentId: 'S103', studentName: 'Charlie Evans', department: 'EE', deptHod: 'Dr. Maxwell', highlightTransitive: false },
              { id: 4, studentId: 'S104', studentName: 'Diana Prince', department: 'CS', deptHod: 'Dr. Turing', highlightTransitive: true }
            ]
          },
          {
            title: 'Table 2: Courses (Partial Dependency Removed)',
            primaryKey: ['CourseID'],
            isComposite: false,
            columns: [
              { key: 'courseId', label: 'CourseID', isPK: true },
              { key: 'courseName', label: 'CourseName' },
              { key: 'instructor', label: 'Instructor' }
            ],
            rows: [
              { id: 1, courseId: 'CS101', courseName: 'Intro to CS', instructor: 'Prof. Ritchie' },
              { id: 2, courseId: 'CS102', courseName: 'Data Structures', instructor: 'Dr. Knuth' },
              { id: 3, courseId: 'MATH201', courseName: 'Calculus', instructor: 'Prof. Gauss' },
              { id: 4, courseId: 'EE101', courseName: 'Circuits', instructor: 'Prof. Tesla' }
            ]
          },
          {
            title: 'Table 3: Enrollments (Fully Dependent on Composite Key)',
            primaryKey: ['StudentID', 'CourseID'],
            isComposite: true,
            columns: [
              { key: 'studentId', label: 'StudentID', isPK: true, isFK: true, fkRef: 'Students.StudentID' },
              { key: 'courseId', label: 'CourseID', isPK: true, isFK: true, fkRef: 'Courses.CourseID' },
              { key: 'grade', label: 'Grade', isFullDep: true }
            ],
            rows: [
              { id: 1, studentId: 'S101', courseId: 'CS101', grade: 'A' },
              { id: 2, studentId: 'S101', courseId: 'MATH201', grade: 'B+' },
              { id: 3, studentId: 'S102', courseId: 'CS101', grade: 'B' },
              { id: 4, studentId: 'S102', courseId: 'CS102', grade: 'A' },
              { id: 5, studentId: 'S103', courseId: 'EE101', grade: 'A-' },
              { id: 6, studentId: 'S104', courseId: 'MATH201', grade: 'A' }
            ]
          }
        ],
        transformationRule: 'Decomposed R into Students(StudentID, StudentName, Dept, HOD), Courses(CourseID, CourseName, Instructor), and Enrollments(StudentID, CourseID, Grade).',
        nextActionText: 'Solve 3NF: Decompose to Eliminate Transitive Dependencies',
        anomalies: {
          insertion: {
            title: 'Insertion Anomaly in 2NF',
            severity: 'medium',
            scenario: 'Courses anomaly solved! (Can insert new course CS301 into Courses table directly). But cannot insert Department "Robotics" without a student.',
            outcome: '⚠️ PARTIAL LIMITATION: Courses table is now independent! But department information is still trapped inside the Students table.'
          },
          update: {
            title: 'Update Anomaly in 2NF',
            severity: 'high',
            scenario: 'The HOD of "CS" changes to Dr. Grace Hopper.',
            outcome: '⚠️ STILL DUPLICATED: Dr. Turing is duplicated in Alice, Bob, and Diana inside the Students table! Still requires 3 row updates.'
          },
          deletion: {
            title: 'Deletion Anomaly in 2NF',
            severity: 'high',
            scenario: 'Charlie Evans (S103) leaves the university.',
            outcome: '❌ DEPT INFO LOST: Deleting Charlie from Students deletes the only record of Electrical Eng and Dr. Maxwell!'
          }
        },
        sqlDDL: `-- 2NF Schemas: 3 Tables, no partial dependencies
CREATE TABLE Students (
    StudentID VARCHAR(10) PRIMARY KEY,
    StudentName VARCHAR(100),
    Department VARCHAR(50),
    DeptHOD VARCHAR(100) -- 3NF Violation: Transitive dependency from StudentID -> Dept -> DeptHOD
);

CREATE TABLE Courses (
    CourseID VARCHAR(10) PRIMARY KEY,
    CourseName VARCHAR(100),
    Instructor VARCHAR(100)
);

CREATE TABLE Enrollments (
    StudentID VARCHAR(10),
    CourseID VARCHAR(10),
    Grade VARCHAR(5),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID),
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID)
);`
      },
      {
        stageIndex: 3,
        id: '3NF',
        name: '3NF (Third Normal Form)',
        badge: 'TRANSITIVE DEPENDENCIES REMOVED',
        badgeColor: 'success',
        summary: 'Transitive dependency eliminated by isolating Departments into its own table. Database is now in 3NF and BCNF! All anomalies eliminated.',
        nfStatus: {
          '1NF': { passed: true, reason: 'Strict atomicity maintained across all relations.' },
          '2NF': { passed: true, reason: 'Zero partial dependencies.' },
          '3NF': { passed: true, reason: 'Zero transitive dependencies! Every FD X -> Y has X as a superkey or Y as a prime attribute.' },
          'BCNF': { passed: true, reason: 'Every determinant across all 4 tables is a superkey.' }
        },
        violations: [],
        tables: [
          {
            title: 'Table 1: Students (Clean 3NF)',
            primaryKey: ['StudentID'],
            isComposite: false,
            columns: [
              { key: 'studentId', label: 'StudentID', isPK: true },
              { key: 'studentName', label: 'StudentName' },
              { key: 'deptId', label: 'DeptID', isFK: true, fkRef: 'Departments.DeptID' }
            ],
            rows: [
              { id: 1, studentId: 'S101', studentName: 'Alice Johnson', deptId: 'CS' },
              { id: 2, studentId: 'S102', studentName: 'Bob Miller', deptId: 'CS' },
              { id: 3, studentId: 'S103', studentName: 'Charlie Evans', deptId: 'EE' },
              { id: 4, studentId: 'S104', studentName: 'Diana Prince', deptId: 'CS' }
            ]
          },
          {
            title: 'Table 2: Departments (Transitive Target Isolated)',
            primaryKey: ['DeptID'],
            isComposite: false,
            columns: [
              { key: 'deptId', label: 'DeptID', isPK: true },
              { key: 'deptName', label: 'Department Name' },
              { key: 'deptHod', label: 'DeptHOD' }
            ],
            rows: [
              { id: 1, deptId: 'CS', deptName: 'Computer Science', deptHod: 'Dr. Turing' },
              { id: 2, deptId: 'EE', deptName: 'Electrical Engineering', deptHod: 'Dr. Maxwell' },
              { id: 3, deptId: 'MATH', deptName: 'Mathematics', deptHod: 'Prof. Gauss' }
            ]
          },
          {
            title: 'Table 3: Courses',
            primaryKey: ['CourseID'],
            isComposite: false,
            columns: [
              { key: 'courseId', label: 'CourseID', isPK: true },
              { key: 'courseName', label: 'CourseName' },
              { key: 'instructor', label: 'Instructor' }
            ],
            rows: [
              { id: 1, courseId: 'CS101', courseName: 'Intro to CS', instructor: 'Prof. Ritchie' },
              { id: 2, courseId: 'CS102', courseName: 'Data Structures', instructor: 'Dr. Knuth' },
              { id: 3, courseId: 'MATH201', courseName: 'Calculus', instructor: 'Prof. Gauss' },
              { id: 4, courseId: 'EE101', courseName: 'Circuits', instructor: 'Prof. Tesla' }
            ]
          },
          {
            title: 'Table 4: Enrollments',
            primaryKey: ['StudentID', 'CourseID'],
            isComposite: true,
            columns: [
              { key: 'studentId', label: 'StudentID', isPK: true, isFK: true, fkRef: 'Students.StudentID' },
              { key: 'courseId', label: 'CourseID', isPK: true, isFK: true, fkRef: 'Courses.CourseID' },
              { key: 'grade', label: 'Grade' }
            ],
            rows: [
              { id: 1, studentId: 'S101', courseId: 'CS101', grade: 'A' },
              { id: 2, studentId: 'S101', courseId: 'MATH201', grade: 'B+' },
              { id: 3, studentId: 'S102', courseId: 'CS101', grade: 'B' },
              { id: 4, studentId: 'S102', courseId: 'CS102', grade: 'A' },
              { id: 5, studentId: 'S103', courseId: 'EE101', grade: 'A-' },
              { id: 6, studentId: 'S104', courseId: 'MATH201', grade: 'A' }
            ]
          }
        ],
        transformationRule: 'Decomposed Students into Students(StudentID, StudentName, DeptID) and Departments(DeptID, DeptName, DeptHOD).',
        nextActionText: 'Inspect BCNF: Verify Boyce-Codd Normal Form Guarantees',
        anomalies: {
          insertion: {
            title: 'Insertion Anomaly Solved',
            severity: 'none',
            scenario: 'Add a new Department ("Mechanical Engineering", HOD: "Dr. Carnot") before any students enroll.',
            outcome: '✅ CLEAN INSERT: Simply insert into the Departments table directly! No student record required.'
          },
          update: {
            title: 'Update Anomaly Solved',
            severity: 'none',
            scenario: 'The HOD of "CS" changes from Dr. Turing to Dr. Grace Hopper.',
            outcome: '✅ ZERO REDUNDANCY: Updates in exactly ONE row in the Departments table. All students instantly reflect the change without inconsistency.'
          },
          deletion: {
            title: 'Deletion Anomaly Solved',
            severity: 'none',
            scenario: 'Charlie Evans (S103) drops out or graduates.',
            outcome: '✅ SAFE DELETION: Deleting Charlie only removes his row in Students. The Electrical Engineering department and Dr. Maxwell remain perfectly intact in Departments!'
          }
        },
        sqlDDL: `-- Fully Normalized 3NF & BCNF Production Schema
CREATE TABLE Departments (
    DeptID VARCHAR(10) PRIMARY KEY,
    DeptName VARCHAR(100) NOT NULL,
    DeptHOD VARCHAR(100) NOT NULL
);

CREATE TABLE Students (
    StudentID VARCHAR(10) PRIMARY KEY,
    StudentName VARCHAR(100) NOT NULL,
    DeptID VARCHAR(10) NOT NULL,
    FOREIGN KEY (DeptID) REFERENCES Departments(DeptID)
);

CREATE TABLE Courses (
    CourseID VARCHAR(10) PRIMARY KEY,
    CourseName VARCHAR(100) NOT NULL,
    Instructor VARCHAR(100) NOT NULL
);

CREATE TABLE Enrollments (
    StudentID VARCHAR(10) NOT NULL,
    CourseID VARCHAR(10) NOT NULL,
    Grade VARCHAR(5),
    PRIMARY KEY (StudentID, CourseID),
    FOREIGN KEY (StudentID) REFERENCES Students(StudentID) ON DELETE CASCADE,
    FOREIGN KEY (CourseID) REFERENCES Courses(CourseID) ON DELETE CASCADE
);`
      },
      {
        stageIndex: 4,
        id: 'BCNF',
        name: 'BCNF (Boyce-Codd Normal Form)',
        badge: 'OPTIMAL LOSSLESS SCHEMA',
        badgeColor: 'emerald',
        summary: 'All determinants in every relation are candidate keys. Zero functional dependency redundancy remains.',
        nfStatus: {
          '1NF': { passed: true, reason: 'Atomic attributes.' },
          '2NF': { passed: true, reason: 'No partial dependencies.' },
          '3NF': { passed: true, reason: 'No transitive dependencies.' },
          'BCNF': { passed: true, reason: 'In all 4 relations: for every FD X -> Y, X is a superkey. BCNF is fully satisfied!' }
        },
        violations: [],
        tables: [
          {
            title: 'Table 1: Departments',
            primaryKey: ['DeptID'],
            isComposite: false,
            columns: [
              { key: 'deptId', label: 'DeptID (PK)', isPK: true },
              { key: 'deptName', label: 'DeptName' },
              { key: 'deptHod', label: 'DeptHOD' }
            ],
            rows: [
              { id: 1, deptId: 'CS', deptName: 'Computer Science', deptHod: 'Dr. Turing' },
              { id: 2, deptId: 'EE', deptName: 'Electrical Engineering', deptHod: 'Dr. Maxwell' },
              { id: 3, deptId: 'MATH', deptName: 'Mathematics', deptHod: 'Prof. Gauss' }
            ]
          },
          {
            title: 'Table 2: Students',
            primaryKey: ['StudentID'],
            isComposite: false,
            columns: [
              { key: 'studentId', label: 'StudentID (PK)', isPK: true },
              { key: 'studentName', label: 'StudentName' },
              { key: 'deptId', label: 'DeptID (FK)', isFK: true, fkRef: 'Departments' }
            ],
            rows: [
              { id: 1, studentId: 'S101', studentName: 'Alice Johnson', deptId: 'CS' },
              { id: 2, studentId: 'S102', studentName: 'Bob Miller', deptId: 'CS' },
              { id: 3, studentId: 'S103', studentName: 'Charlie Evans', deptId: 'EE' },
              { id: 4, studentId: 'S104', studentName: 'Diana Prince', deptId: 'CS' }
            ]
          },
          {
            title: 'Table 3: Courses',
            primaryKey: ['CourseID'],
            isComposite: false,
            columns: [
              { key: 'courseId', label: 'CourseID (PK)', isPK: true },
              { key: 'courseName', label: 'CourseName' },
              { key: 'instructor', label: 'Instructor' }
            ],
            rows: [
              { id: 1, courseId: 'CS101', courseName: 'Intro to CS', instructor: 'Prof. Ritchie' },
              { id: 2, courseId: 'CS102', courseName: 'Data Structures', instructor: 'Dr. Knuth' },
              { id: 3, courseId: 'MATH201', courseName: 'Calculus', instructor: 'Prof. Gauss' },
              { id: 4, courseId: 'EE101', courseName: 'Circuits', instructor: 'Prof. Tesla' }
            ]
          },
          {
            title: 'Table 4: Enrollments',
            primaryKey: ['StudentID', 'CourseID'],
            isComposite: true,
            columns: [
              { key: 'studentId', label: 'StudentID (PK, FK)', isPK: true, isFK: true },
              { key: 'courseId', label: 'CourseID (PK, FK)', isPK: true, isFK: true },
              { key: 'grade', label: 'Grade' }
            ],
            rows: [
              { id: 1, studentId: 'S101', courseId: 'CS101', grade: 'A' },
              { id: 2, studentId: 'S101', courseId: 'MATH201', grade: 'B+' },
              { id: 3, studentId: 'S102', courseId: 'CS101', grade: 'B' },
              { id: 4, studentId: 'S102', courseId: 'CS102', grade: 'A' },
              { id: 5, studentId: 'S103', courseId: 'EE101', grade: 'A-' },
              { id: 6, studentId: 'S104', courseId: 'MATH201', grade: 'A' }
            ]
          }
        ],
        transformationRule: 'BCNF Achieved: Every determinant is a candidate key. No non-trivial FD remains whose determinant is not a superkey.',
        nextActionText: 'Restart Simulation from UNF',
        anomalies: {
          insertion: { title: 'No Insertion Anomalies', severity: 'none', scenario: 'Add any entity independently', outcome: '✅ Seamless inserts into all tables.' },
          update: { title: 'No Update Anomalies', severity: 'none', scenario: 'Update any attribute', outcome: '✅ Each fact stored in exactly one place.' },
          deletion: { title: 'No Deletion Anomalies', severity: 'none', scenario: 'Delete any relationship or student', outcome: '✅ Foreign key cascade or set null maintains complete database integrity.' }
        },
        sqlDDL: `-- Full BCNF Compliant Relational Model
-- Preserves all functional dependencies and ensures lossless join decomposition.`
      }
    ]
  },

  {
    id: 'company',
    name: '🏢 Company Employee & Project Assignments',
    shortName: 'Employee Projects',
    description: 'Tracks employees, departments, department managers, assigned projects, clients, and allocated hours.',
    analyzerAttributes: 'EmpID, EmpName, DeptCode, DeptManager, ProjectID, ProjectName, Client, Hours',
    analyzerFDs: 'EmpID -> EmpName, DeptCode\nDeptCode -> DeptManager\nProjectID -> ProjectName, Client\nEmpID, ProjectID -> Hours',
    stages: [
      {
        stageIndex: 0,
        id: 'UNF',
        name: 'UNF (Unnormalized Form)',
        badge: 'ALL NFs VIOLATED',
        badgeColor: 'danger',
        summary: 'Stores employees with multi-valued project assignments, department manager dependencies, and project client details in one raw table.',
        nfStatus: {
          '1NF': { passed: false, reason: 'AssignedProjects, Clients, and Hours are multi-valued lists.' },
          '2NF': { passed: false, reason: 'Composite key (EmpID, ProjectID) has partial dependencies.' },
          '3NF': { passed: false, reason: 'Transitive dependency: EmpID -> DeptCode -> DeptManager.' },
          'BCNF': { passed: false, reason: 'DeptCode and ProjectID are determinants but not candidate keys.' }
        },
        violations: [
          { type: '1NF', label: 'Multi-valued cells in Projects and Hours', details: 'A single employee row contains multiple project allocations separated by commas.' },
          { type: '2NF', label: 'Partial Dependency: EmpID → (EmpName, DeptCode, DeptManager)', details: 'Employee attributes depend on EmpID alone, ignoring ProjectID.' },
          { type: '3NF', label: 'Transitive Dependency: DeptCode → DeptManager', details: 'DeptManager depends on DeptCode, which in turn depends on EmpID.' }
        ],
        tables: [
          {
            title: 'R_UNF: Employee_Project_Registry',
            primaryKey: ['EmpID', 'Projects'],
            isComposite: true,
            columns: [
              { key: 'empId', label: 'EmpID', isPK: true, role: 'key-part' },
              { key: 'empName', label: 'EmpName', isPartial: true },
              { key: 'deptCode', label: 'DeptCode', isPartial: true, isTransitiveDet: true },
              { key: 'deptManager', label: 'DeptManager', isPartial: true, isTransitiveTarget: true },
              { key: 'projects', label: 'Projects', isMulti: true, isPK: true, role: 'key-part' },
              { key: 'hours', label: 'Hours', isMulti: true }
            ],
            rows: [
              { id: 1, empId: 'E201', empName: 'Sophia Miller', deptCode: 'ENG', deptManager: 'Marcus Vance', projects: ['PRJ-Alpha (Cloud Migration)', 'PRJ-Beta (API Gateway)'], hours: ['20 hrs', '20 hrs'], highlight: true },
              { id: 2, empId: 'E202', empName: 'Liam Chen', deptCode: 'ENG', deptManager: 'Marcus Vance', projects: ['PRJ-Alpha (Cloud Migration)'], hours: ['40 hrs'], highlight: false },
              { id: 3, empId: 'E203', empName: 'Aria Stark', deptCode: 'MKT', deptManager: 'Sarah Connor', projects: ['PRJ-Gamma (SEO Campaign)'], hours: ['35 hrs'], highlight: true }
            ]
          }
        ],
        transformationRule: 'Unnormalized raw table with non-atomic repeating groups and multiple partial/transitive dependencies.',
        nextActionText: 'Solve 1NF: Unpack Multi-Valued Allocations into Atomic Rows',
        anomalies: {
          insertion: { title: 'Insertion Anomaly', severity: 'critical', scenario: 'Add a new department "HR" before hiring staff.', outcome: '❌ Cannot insert because EmpID cannot be NULL.' },
          update: { title: 'Update Anomaly', severity: 'high', scenario: 'ENG manager Marcus Vance is replaced.', outcome: '⚠️ Must update multiple employee rows; high chance of mismatch.' },
          deletion: { title: 'Deletion Anomaly', severity: 'critical', scenario: 'Aria Stark resigns.', outcome: '❌ Deletes the MKT department and Sarah Connor info entirely!' }
        },
        sqlDDL: `CREATE TABLE Emp_Projects_UNF (
    EmpID VARCHAR(10),
    EmpName VARCHAR(100),
    DeptCode VARCHAR(10),
    DeptManager VARCHAR(100),
    Projects TEXT,
    Hours TEXT
);`
      },
      {
        stageIndex: 1,
        id: '1NF',
        name: '1NF (First Normal Form)',
        badge: 'ATOMICITY ENFORCED',
        badgeColor: 'warning',
        summary: 'All project allocations are flattened to individual rows. Notice the duplicate employee details repeating across rows!',
        nfStatus: {
          '1NF': { passed: true, reason: 'All cell values are single atomic units.' },
          '2NF': { passed: false, reason: 'Partial dependencies on composite key (EmpID, ProjectID).' },
          '3NF': { passed: false, reason: 'DeptCode -> DeptManager is a transitive dependency.' },
          'BCNF': { passed: false, reason: 'Determinants EmpID, ProjectID, DeptCode are not superkeys.' }
        },
        violations: [
          { type: '2NF', label: 'Partial Dependency: EmpID → (EmpName, DeptCode, DeptManager)', details: 'Employee fields depend on EmpID, only part of key.' },
          { type: '2NF', label: 'Partial Dependency: ProjectID → (ProjectName, Client)', details: 'Project fields depend on ProjectID, only part of key.' },
          { type: '3NF', label: 'Transitive Dependency: DeptCode → DeptManager', details: 'Non-prime department code determines non-prime manager.' }
        ],
        tables: [
          {
            title: 'R_1NF: Employee_Project_Atomic',
            primaryKey: ['EmpID', 'ProjectID'],
            isComposite: true,
            columns: [
              { key: 'empId', label: 'EmpID', isPK: true, role: 'key-part' },
              { key: 'empName', label: 'EmpName', isPartial: true },
              { key: 'deptCode', label: 'DeptCode', isPartial: true, isTransitiveDet: true },
              { key: 'deptManager', label: 'DeptManager', isPartial: true, isTransitiveTarget: true },
              { key: 'projectId', label: 'ProjectID', isPK: true, role: 'key-part' },
              { key: 'projectName', label: 'ProjectName', isPartial: true },
              { key: 'client', label: 'Client', isPartial: true },
              { key: 'hours', label: 'Hours', isFullDep: true }
            ],
            rows: [
              { id: 1, empId: 'E201', empName: 'Sophia Miller', deptCode: 'ENG', deptManager: 'Marcus Vance', projectId: 'PRJ-Alpha', projectName: 'Cloud Migration', client: 'Acme Corp', hours: 20 },
              { id: 2, empId: 'E201', empName: 'Sophia Miller', deptCode: 'ENG', deptManager: 'Marcus Vance', projectId: 'PRJ-Beta', projectName: 'API Gateway', client: 'Globex Inc', hours: 20 },
              { id: 3, empId: 'E202', empName: 'Liam Chen', deptCode: 'ENG', deptManager: 'Marcus Vance', projectId: 'PRJ-Alpha', projectName: 'Cloud Migration', client: 'Acme Corp', hours: 40 },
              { id: 4, empId: 'E203', empName: 'Aria Stark', deptCode: 'MKT', deptManager: 'Sarah Connor', projectId: 'PRJ-Gamma', projectName: 'SEO Campaign', client: 'Wayne Ent', hours: 35 }
            ]
          }
        ],
        transformationRule: 'Flattened repeating projects into atomic rows with composite PK (EmpID, ProjectID).',
        nextActionText: 'Solve 2NF: Decompose to Eliminate Partial Dependencies',
        anomalies: {
          insertion: { title: 'Insertion Anomaly', severity: 'critical', scenario: 'Add a new project before assigning employees.', outcome: '❌ Cannot insert because EmpID cannot be NULL.' },
          update: { title: 'Update Anomaly', severity: 'high', scenario: 'Acme Corp changes client name.', outcome: '⚠️ Must update in multiple rows (Sophia and Liam).' },
          deletion: { title: 'Deletion Anomaly', severity: 'critical', scenario: 'Aria Stark leaves.', outcome: '❌ Deletes the MKT department and PRJ-Gamma info!' }
        },
        sqlDDL: `CREATE TABLE Emp_Project_1NF (
    EmpID VARCHAR(10),
    ProjectID VARCHAR(10),
    EmpName VARCHAR(100),
    DeptCode VARCHAR(10),
    DeptManager VARCHAR(100),
    ProjectName VARCHAR(100),
    Client VARCHAR(100),
    Hours INT,
    PRIMARY KEY (EmpID, ProjectID)
);`
      },
      {
        stageIndex: 2,
        id: '2NF',
        name: '2NF (Second Normal Form)',
        badge: 'PARTIAL DEPENDENCIES REMOVED',
        badgeColor: 'info',
        summary: 'Decomposed into Employees, Projects, and Project_Assignments. Zero partial dependencies remain, but DeptCode -> DeptManager is still transitive.',
        nfStatus: {
          '1NF': { passed: true, reason: 'Atomic values.' },
          '2NF': { passed: true, reason: 'No partial dependencies on composite keys.' },
          '3NF': { passed: false, reason: 'Employees table has transitive dependency DeptCode -> DeptManager.' },
          'BCNF': { passed: false, reason: 'DeptCode is not a candidate key in Employees table.' }
        },
        violations: [
          { type: '3NF', label: 'Transitive Dependency: DeptCode → DeptManager', details: 'EmpID determines DeptCode, which determines DeptManager in Employees table.' }
        ],
        tables: [
          {
            title: 'Table 1: Employees',
            primaryKey: ['EmpID'],
            isComposite: false,
            columns: [
              { key: 'empId', label: 'EmpID', isPK: true },
              { key: 'empName', label: 'EmpName' },
              { key: 'deptCode', label: 'DeptCode', isTransitiveDet: true },
              { key: 'deptManager', label: 'DeptManager', isTransitiveTarget: true }
            ],
            rows: [
              { id: 1, empId: 'E201', empName: 'Sophia Miller', deptCode: 'ENG', deptManager: 'Marcus Vance' },
              { id: 2, empId: 'E202', empName: 'Liam Chen', deptCode: 'ENG', deptManager: 'Marcus Vance' },
              { id: 3, empId: 'E203', empName: 'Aria Stark', deptCode: 'MKT', deptManager: 'Sarah Connor' }
            ]
          },
          {
            title: 'Table 2: Projects',
            primaryKey: ['ProjectID'],
            isComposite: false,
            columns: [
              { key: 'projectId', label: 'ProjectID', isPK: true },
              { key: 'projectName', label: 'ProjectName' },
              { key: 'client', label: 'Client' }
            ],
            rows: [
              { id: 1, projectId: 'PRJ-Alpha', projectName: 'Cloud Migration', client: 'Acme Corp' },
              { id: 2, projectId: 'PRJ-Beta', projectName: 'API Gateway', client: 'Globex Inc' },
              { id: 3, projectId: 'PRJ-Gamma', projectName: 'SEO Campaign', client: 'Wayne Ent' }
            ]
          },
          {
            title: 'Table 3: Project_Assignments',
            primaryKey: ['EmpID', 'ProjectID'],
            isComposite: true,
            columns: [
              { key: 'empId', label: 'EmpID', isPK: true, isFK: true, fkRef: 'Employees.EmpID' },
              { key: 'projectId', label: 'ProjectID', isPK: true, isFK: true, fkRef: 'Projects.ProjectID' },
              { key: 'hours', label: 'Hours' }
            ],
            rows: [
              { id: 1, empId: 'E201', projectId: 'PRJ-Alpha', hours: 20 },
              { id: 2, empId: 'E201', projectId: 'PRJ-Beta', hours: 20 },
              { id: 3, empId: 'E202', projectId: 'PRJ-Alpha', hours: 40 },
              { id: 4, empId: 'E203', projectId: 'PRJ-Gamma', hours: 35 }
            ]
          }
        ],
        transformationRule: 'Decomposed R into Employees, Projects, and Project_Assignments.',
        nextActionText: 'Solve 3NF: Decompose to Eliminate Transitive Dependencies',
        anomalies: {
          insertion: { title: 'Partial Insertion Anomaly', severity: 'medium', scenario: 'Add a new department "Finance" without an employee.', outcome: '⚠️ Still cannot store department without employee.' },
          update: { title: 'Update Anomaly', severity: 'medium', scenario: 'ENG manager changes.', outcome: '⚠️ Duplicated across ENG employees.' },
          deletion: { title: 'Deletion Anomaly', severity: 'high', scenario: 'Aria Stark leaves.', outcome: '❌ Deletes the MKT department and Sarah Connor info.' }
        },
        sqlDDL: `CREATE TABLE Employees (
    EmpID VARCHAR(10) PRIMARY KEY,
    EmpName VARCHAR(100),
    DeptCode VARCHAR(10),
    DeptManager VARCHAR(100) -- Transitive dependency!
);

CREATE TABLE Projects (
    ProjectID VARCHAR(10) PRIMARY KEY,
    ProjectName VARCHAR(100),
    Client VARCHAR(100)
);

CREATE TABLE Project_Assignments (
    EmpID VARCHAR(10),
    ProjectID VARCHAR(10),
    Hours INT,
    PRIMARY KEY (EmpID, ProjectID)
);`
      },
      {
        stageIndex: 3,
        id: '3NF',
        name: '3NF & BCNF',
        badge: 'FULLY NORMALIZED',
        badgeColor: 'success',
        summary: 'Departments isolated into its own table. Zero transitive dependencies, zero partial dependencies, and all determinants are candidate keys.',
        nfStatus: {
          '1NF': { passed: true, reason: 'Atomic attributes.' },
          '2NF': { passed: true, reason: 'No partial dependencies.' },
          '3NF': { passed: true, reason: 'No transitive dependencies.' },
          'BCNF': { passed: true, reason: 'All determinants are superkeys.' }
        },
        violations: [],
        tables: [
          {
            title: 'Table 1: Employees',
            primaryKey: ['EmpID'],
            isComposite: false,
            columns: [
              { key: 'empId', label: 'EmpID', isPK: true },
              { key: 'empName', label: 'EmpName' },
              { key: 'deptCode', label: 'DeptCode', isFK: true, fkRef: 'Departments.DeptCode' }
            ],
            rows: [
              { id: 1, empId: 'E201', empName: 'Sophia Miller', deptCode: 'ENG' },
              { id: 2, empId: 'E202', empName: 'Liam Chen', deptCode: 'ENG' },
              { id: 3, empId: 'E203', empName: 'Aria Stark', deptCode: 'MKT' }
            ]
          },
          {
            title: 'Table 2: Departments',
            primaryKey: ['DeptCode'],
            isComposite: false,
            columns: [
              { key: 'deptCode', label: 'DeptCode', isPK: true },
              { key: 'deptManager', label: 'DeptManager' }
            ],
            rows: [
              { id: 1, deptCode: 'ENG', deptManager: 'Marcus Vance' },
              { id: 2, deptCode: 'MKT', deptManager: 'Sarah Connor' },
              { id: 3, deptCode: 'FIN', deptManager: 'David Geller' }
            ]
          },
          {
            title: 'Table 3: Projects',
            primaryKey: ['ProjectID'],
            isComposite: false,
            columns: [
              { key: 'projectId', label: 'ProjectID', isPK: true },
              { key: 'projectName', label: 'ProjectName' },
              { key: 'client', label: 'Client' }
            ],
            rows: [
              { id: 1, projectId: 'PRJ-Alpha', projectName: 'Cloud Migration', client: 'Acme Corp' },
              { id: 2, projectId: 'PRJ-Beta', projectName: 'API Gateway', client: 'Globex Inc' },
              { id: 3, projectId: 'PRJ-Gamma', projectName: 'SEO Campaign', client: 'Wayne Ent' }
            ]
          },
          {
            title: 'Table 4: Project_Assignments',
            primaryKey: ['EmpID', 'ProjectID'],
            isComposite: true,
            columns: [
              { key: 'empId', label: 'EmpID', isPK: true, isFK: true },
              { key: 'projectId', label: 'ProjectID', isPK: true, isFK: true },
              { key: 'hours', label: 'Hours' }
            ],
            rows: [
              { id: 1, empId: 'E201', projectId: 'PRJ-Alpha', hours: 20 },
              { id: 2, empId: 'E201', projectId: 'PRJ-Beta', hours: 20 },
              { id: 3, empId: 'E202', projectId: 'PRJ-Alpha', hours: 40 },
              { id: 4, empId: 'E203', projectId: 'PRJ-Gamma', hours: 35 }
            ]
          }
        ],
        transformationRule: 'Decomposed Employees into Employees(EmpID, EmpName, DeptCode) and Departments(DeptCode, DeptManager).',
        nextActionText: 'Restart Simulation from UNF',
        anomalies: {
          insertion: { title: 'Insertion Anomaly Solved', severity: 'none', scenario: 'Add a new department "HR" with manager.', outcome: '✅ Direct insert into Departments table without employees!' },
          update: { title: 'Update Anomaly Solved', severity: 'none', scenario: 'Change ENG department manager.', outcome: '✅ Updates exactly one row in Departments.' },
          deletion: { title: 'Deletion Anomaly Solved', severity: 'none', scenario: 'Aria Stark resigns.', outcome: '✅ Deleting Aria leaves the MKT department and Sarah Connor intact!' }
        },
        sqlDDL: `CREATE TABLE Departments (
    DeptCode VARCHAR(10) PRIMARY KEY,
    DeptManager VARCHAR(100) NOT NULL
);

CREATE TABLE Employees (
    EmpID VARCHAR(10) PRIMARY KEY,
    EmpName VARCHAR(100) NOT NULL,
    DeptCode VARCHAR(10) NOT NULL REFERENCES Departments(DeptCode)
);

CREATE TABLE Projects (
    ProjectID VARCHAR(10) PRIMARY KEY,
    ProjectName VARCHAR(100) NOT NULL,
    Client VARCHAR(100) NOT NULL
);

CREATE TABLE Project_Assignments (
    EmpID VARCHAR(10) REFERENCES Employees(EmpID),
    ProjectID VARCHAR(10) REFERENCES Projects(ProjectID),
    Hours INT NOT NULL,
    PRIMARY KEY (EmpID, ProjectID)
);`
      }
    ]
  }
];
