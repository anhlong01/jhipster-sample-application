package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class SubjectRegisterTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SubjectRegister getSubjectRegisterSample1() {
        return new SubjectRegister().id(1L);
    }

    public static SubjectRegister getSubjectRegisterSample2() {
        return new SubjectRegister().id(2L);
    }

    public static SubjectRegister getSubjectRegisterRandomSampleGenerator() {
        return new SubjectRegister().id(longCount.incrementAndGet());
    }
}
