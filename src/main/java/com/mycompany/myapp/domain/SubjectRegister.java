package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A SubjectRegister.
 */
@Entity
@Table(name = "subject_register", uniqueConstraints = { @UniqueConstraint(columnNames = { "student_id", "subject_id" }) })
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SubjectRegister implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @JoinColumn(name = "student_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Student student;

    @JoinColumn(name = "subject_id", nullable = false)
    @ManyToOne(fetch = FetchType.EAGER)
    private Subject subject;

    @JsonIgnoreProperties(value = { "subjectRegister" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "subjectRegister")
    private Mark mark;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public SubjectRegister id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return this.student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public SubjectRegister student(Student student) {
        this.setStudent(student);
        return this;
    }

    public Subject getSubject() {
        return this.subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public SubjectRegister subject(Subject subject) {
        this.setSubject(subject);
        return this;
    }

    public Mark getMark() {
        return this.mark;
    }

    public void setMark(Mark mark) {
        if (this.mark != null) {
            this.mark.setSubjectRegister(null);
        }
        if (mark != null) {
            mark.setSubjectRegister(this);
        }
        this.mark = mark;
    }

    public SubjectRegister mark(Mark mark) {
        this.setMark(mark);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SubjectRegister)) {
            return false;
        }
        return getId() != null && getId().equals(((SubjectRegister) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SubjectRegister{" +
            "id=" + getId() +
            "}";
    }
}
