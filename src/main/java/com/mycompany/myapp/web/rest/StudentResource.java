package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Mark;
import com.mycompany.myapp.domain.Student;
import com.mycompany.myapp.domain.SubjectRegister;
import com.mycompany.myapp.repository.MarkRepository;
import com.mycompany.myapp.repository.StudentRepository;
import com.mycompany.myapp.repository.SubjectRegisterRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Student}.
 */
@RestController
@RequestMapping("/api/students")
@Transactional
public class StudentResource {

    private static final Logger LOG = LoggerFactory.getLogger(StudentResource.class);

    private static final String ENTITY_NAME = "student";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubjectRegisterRepository subjectregisterRepository;
    private final StudentRepository studentRepository;
    private final MarkRepository markRepository;

    public StudentResource(
        StudentRepository studentRepository,
        SubjectRegisterRepository subjectregisterRepository,
        MarkRepository markRepository
    ) {
        this.studentRepository = studentRepository;
        this.subjectregisterRepository = subjectregisterRepository;
        this.markRepository = markRepository;
    }

    /**
     * {@code POST  /students} : Create a new student.
     *
     * @param student the student to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new student, or with status {@code 400 (Bad Request)} if the student has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) throws URISyntaxException {
        LOG.debug("REST request to save Student : {}", student);
        if (student.getId() != null) {
            throw new BadRequestAlertException("A new student cannot already have an ID", ENTITY_NAME, "idexists");
        }
        student = studentRepository.save(student);
        return ResponseEntity.created(new URI("/api/students/" + student.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, student.getId().toString()))
            .body(student);
    }

    /**
     * {@code PUT  /students/:id} : Updates an existing student.
     *
     * @param id the id of the student to save.
     * @param student the student to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated student,
     * or with status {@code 400 (Bad Request)} if the student is not valid,
     * or with status {@code 500 (Internal Server Error)} if the student couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable(value = "id", required = false) final Long id, @RequestBody Student student)
        throws URISyntaxException {
        LOG.debug("REST request to update Student : {}, {}", id, student);
        if (student.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, student.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        student = studentRepository.save(student);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, student.getId().toString()))
            .body(student);
    }

    /**
     * {@code PATCH  /students/:id} : Partial updates given fields of an existing student, field will ignore if it is null
     *
     * @param id the id of the student to save.
     * @param student the student to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated student,
     * or with status {@code 400 (Bad Request)} if the student is not valid,
     * or with status {@code 404 (Not Found)} if the student is not found,
     * or with status {@code 500 (Internal Server Error)} if the student couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Student> partialUpdateStudent(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Student student
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Student partially : {}, {}", id, student);
        if (student.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, student.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Student> result = studentRepository
            .findById(student.getId())
            .map(existingStudent -> {
                if (student.getStudentName() != null) {
                    existingStudent.setStudentName(student.getStudentName());
                }
                if (student.getSex() != null) {
                    existingStudent.setSex(student.getSex());
                }
                if (student.getStudentClass() != null) {
                    existingStudent.setStudentClass(student.getStudentClass());
                }
                if (student.getStudentKhoahoc() != null) {
                    existingStudent.setStudentKhoahoc(student.getStudentKhoahoc());
                }
                if (student.getDob() != null) {
                    existingStudent.setDob(student.getDob());
                }

                return existingStudent;
            })
            .map(studentRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, student.getId().toString())
        );
    }

    /**
     * {@code GET  /students} : get all the students.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of students in body.
     */
    @GetMapping("")
    public List<Student> getAllStudents() {
        LOG.debug("REST request to get all Students");
        return studentRepository.findAll();
    }

    /**
     * {@code GET  /students/:id} : get the "id" student.
     *
     * @param id the id of the student to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the student, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Student : {}", id);
        Optional<Student> student = studentRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(student);
    }

    /**
     * {@code DELETE  /students/:id} : delete the "id" student.
     *
     * @param id the id of the student to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Student : {}", id);
        studentRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/subject/{id}")
    public ResponseEntity<List<String>> getSubjectById(@PathVariable("id") Long id) {
        LOG.debug("REST request to get subject by id {}", id);
        List<SubjectRegister> list = subjectregisterRepository.findAllByStudentId(id);
        List<String> res = list.stream().map(subjectRegister -> subjectRegister.getSubject().getSubjectDescription()).toList();
        return ResponseEntity.ok().body(res);
    }

    @GetMapping("/mark/{id}")
    public ResponseEntity<HashMap<String, Float>> getMarkById(@PathVariable("id") Long id) {
        LOG.debug("REST request to get mark by id {}", id);
        List<SubjectRegister> list = subjectregisterRepository.findAllByStudentId(id);
        if (list.size() == 0) throw new BadRequestAlertException("sinh viên chưa đăng ký môn nào", ENTITY_NAME, "not_registered");
        HashMap<String, Float> map = new HashMap();
        for (SubjectRegister s : list) {
            if (markRepository.existsBySubjectRegisterId(s.getId())) {
                Mark m = markRepository.findBySubjectRegisterId(s.getId());
                map.put(s.getSubject().getSubjectDescription(), m.getScore());
            }
        }
        if (map.size() == 0) throw new BadRequestAlertException("sinh viên chưa có điểm", ENTITY_NAME, "empty_map");

        return ResponseEntity.ok().body(map);
    }

    @GetMapping("check/{id}")
    public ResponseEntity<String> checkPass(@PathVariable("id") long id) {
        LOG.debug("REST request to get mark by id {}", id);
        HashMap<String, Float> map = getMarkById(id).getBody();
        boolean isPassed = true;
        for (float score : map.values()) {
            if (score < 4) isPassed = false;
        }

        String res = isPassed ? "Sinh viên này qua môn rồi" : "Sinh viên này tạch môn rồi";
        return ResponseEntity.ok().body(res);
    }
}
