package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mark.
 */
@Entity
@Table(name = "mark")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Mark implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "score")
    private Float score;

    @JsonIgnoreProperties(value = { "student", "subject", "mark" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true, nullable = false)
    private SubjectRegister subjectRegister;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Mark id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Float getScore() {
        return this.score;
    }

    public Mark score(Float score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Float score) {
        this.score = score;
    }

    public SubjectRegister getSubjectRegister() {
        return this.subjectRegister;
    }

    public void setSubjectRegister(SubjectRegister subjectRegister) {
        this.subjectRegister = subjectRegister;
    }

    public Mark subjectRegister(SubjectRegister subjectRegister) {
        this.setSubjectRegister(subjectRegister);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mark)) {
            return false;
        }
        return getId() != null && getId().equals(((Mark) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mark{" +
            "id=" + getId() +
            ", score=" + getScore() +
            "}";
    }
}
