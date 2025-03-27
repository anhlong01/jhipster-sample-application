package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.SubjectRegister;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SubjectRegister entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SubjectRegisterRepository extends JpaRepository<SubjectRegister, Long> {
    List<SubjectRegister> findAllByStudentId(Long studentId);
}
