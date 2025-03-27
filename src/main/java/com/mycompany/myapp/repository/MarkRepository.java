package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Mark;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mark entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MarkRepository extends JpaRepository<Mark, Long> {
    boolean existsBySubjectRegisterId(Long id);
    Mark findBySubjectRegisterId(Long id);
}
