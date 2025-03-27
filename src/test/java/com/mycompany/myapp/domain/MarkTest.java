package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.MarkTestSamples.*;
import static com.mycompany.myapp.domain.SubjectRegisterTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MarkTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mark.class);
        Mark mark1 = getMarkSample1();
        Mark mark2 = new Mark();
        assertThat(mark1).isNotEqualTo(mark2);

        mark2.setId(mark1.getId());
        assertThat(mark1).isEqualTo(mark2);

        mark2 = getMarkSample2();
        assertThat(mark1).isNotEqualTo(mark2);
    }

    @Test
    void subjectRegisterTest() {
        Mark mark = getMarkRandomSampleGenerator();
        SubjectRegister subjectRegisterBack = getSubjectRegisterRandomSampleGenerator();

        mark.setSubjectRegister(subjectRegisterBack);
        assertThat(mark.getSubjectRegister()).isEqualTo(subjectRegisterBack);

        mark.subjectRegister(null);
        assertThat(mark.getSubjectRegister()).isNull();
    }
}
