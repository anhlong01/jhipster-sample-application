package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class StudentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Student getStudentSample1() {
        return new Student().id(1L).studentName("studentName1").sex("sex1").studentClass("studentClass1").studentKhoahoc("studentKhoahoc1");
    }

    public static Student getStudentSample2() {
        return new Student().id(2L).studentName("studentName2").sex("sex2").studentClass("studentClass2").studentKhoahoc("studentKhoahoc2");
    }

    public static Student getStudentRandomSampleGenerator() {
        return new Student()
            .id(longCount.incrementAndGet())
            .studentName(UUID.randomUUID().toString())
            .sex(UUID.randomUUID().toString())
            .studentClass(UUID.randomUUID().toString())
            .studentKhoahoc(UUID.randomUUID().toString());
    }
}
