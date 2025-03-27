package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.MarkTestSamples.*;
import static com.mycompany.myapp.domain.StudentTestSamples.*;
import static com.mycompany.myapp.domain.SubjectRegisterTestSamples.*;
import static com.mycompany.myapp.domain.SubjectTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SubjectRegisterTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SubjectRegister.class);
        SubjectRegister subjectRegister1 = getSubjectRegisterSample1();
        SubjectRegister subjectRegister2 = new SubjectRegister();
        assertThat(subjectRegister1).isNotEqualTo(subjectRegister2);

        subjectRegister2.setId(subjectRegister1.getId());
        assertThat(subjectRegister1).isEqualTo(subjectRegister2);

        subjectRegister2 = getSubjectRegisterSample2();
        assertThat(subjectRegister1).isNotEqualTo(subjectRegister2);
    }

    @Test
    void studentTest() {
        SubjectRegister subjectRegister = getSubjectRegisterRandomSampleGenerator();
        Student studentBack = getStudentRandomSampleGenerator();

        subjectRegister.setStudent(studentBack);
        assertThat(subjectRegister.getStudent()).isEqualTo(studentBack);

        subjectRegister.student(null);
        assertThat(subjectRegister.getStudent()).isNull();
    }

    @Test
    void subjectTest() {
        SubjectRegister subjectRegister = getSubjectRegisterRandomSampleGenerator();
        Subject subjectBack = getSubjectRandomSampleGenerator();

        subjectRegister.setSubject(subjectBack);
        assertThat(subjectRegister.getSubject()).isEqualTo(subjectBack);

        subjectRegister.subject(null);
        assertThat(subjectRegister.getSubject()).isNull();
    }

    @Test
    void markTest() {
        SubjectRegister subjectRegister = getSubjectRegisterRandomSampleGenerator();
        Mark markBack = getMarkRandomSampleGenerator();

        subjectRegister.setMark(markBack);
        assertThat(subjectRegister.getMark()).isEqualTo(markBack);
        assertThat(markBack.getSubjectRegister()).isEqualTo(subjectRegister);

        subjectRegister.mark(null);
        assertThat(subjectRegister.getMark()).isNull();
        assertThat(markBack.getSubjectRegister()).isNull();
    }
}
