package com.mycompany.myapp.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class MarkTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Mark getMarkSample1() {
        return new Mark().id(1L);
    }

    public static Mark getMarkSample2() {
        return new Mark().id(2L);
    }

    public static Mark getMarkRandomSampleGenerator() {
        return new Mark().id(longCount.incrementAndGet());
    }
}
