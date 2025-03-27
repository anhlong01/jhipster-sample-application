package com.mycompany.myapp.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Student.
 */
@Entity
@Table(name = "student")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Student implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "student_name")
    private String studentName;

    @Column(name = "sex")
    private String sex;

    @Column(name = "student_class")
    private String studentClass;

    @Column(name = "student_khoahoc")
    private String studentKhoahoc;

    @Column(name = "dob")
    private LocalDate dob;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Student id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return this.studentName;
    }

    public Student studentName(String studentName) {
        this.setStudentName(studentName);
        return this;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getSex() {
        return this.sex;
    }

    public Student sex(String sex) {
        this.setSex(sex);
        return this;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getStudentClass() {
        return this.studentClass;
    }

    public Student studentClass(String studentClass) {
        this.setStudentClass(studentClass);
        return this;
    }

    public void setStudentClass(String studentClass) {
        this.studentClass = studentClass;
    }

    public String getStudentKhoahoc() {
        return this.studentKhoahoc;
    }

    public Student studentKhoahoc(String studentKhoahoc) {
        this.setStudentKhoahoc(studentKhoahoc);
        return this;
    }

    public void setStudentKhoahoc(String studentKhoahoc) {
        this.studentKhoahoc = studentKhoahoc;
    }

    public LocalDate getDob() {
        return this.dob;
    }

    public Student dob(LocalDate dob) {
        this.setDob(dob);
        return this;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Student)) {
            return false;
        }
        return getId() != null && getId().equals(((Student) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Student{" +
            "id=" + getId() +
            ", studentName='" + getStudentName() + "'" +
            ", sex='" + getSex() + "'" +
            ", studentClass='" + getStudentClass() + "'" +
            ", studentKhoahoc='" + getStudentKhoahoc() + "'" +
            ", dob='" + getDob() + "'" +
            "}";
    }
}
