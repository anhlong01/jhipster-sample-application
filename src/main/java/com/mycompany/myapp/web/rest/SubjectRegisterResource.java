package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.SubjectRegister;
import com.mycompany.myapp.repository.SubjectRegisterRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.SubjectRegister}.
 */
@RestController
@RequestMapping("/api/subject-registers")
@Transactional
public class SubjectRegisterResource {

    private static final Logger LOG = LoggerFactory.getLogger(SubjectRegisterResource.class);

    private static final String ENTITY_NAME = "subjectRegister";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SubjectRegisterRepository subjectRegisterRepository;

    public SubjectRegisterResource(SubjectRegisterRepository subjectRegisterRepository) {
        this.subjectRegisterRepository = subjectRegisterRepository;
    }

    /**
     * {@code POST  /subject-registers} : Create a new subjectRegister.
     *
     * @param subjectRegister the subjectRegister to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new subjectRegister, or with status {@code 400 (Bad Request)} if the subjectRegister has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<SubjectRegister> createSubjectRegister(@RequestBody SubjectRegister subjectRegister) throws URISyntaxException {
        LOG.debug("REST request to save SubjectRegister : {}", subjectRegister);
        if (subjectRegister.getId() != null) {
            throw new BadRequestAlertException("A new subjectRegister cannot already have an ID", ENTITY_NAME, "idexists");
        }
        subjectRegister = subjectRegisterRepository.save(subjectRegister);
        return ResponseEntity.created(new URI("/api/subject-registers/" + subjectRegister.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, subjectRegister.getId().toString()))
            .body(subjectRegister);
    }

    /**
     * {@code PUT  /subject-registers/:id} : Updates an existing subjectRegister.
     *
     * @param id the id of the subjectRegister to save.
     * @param subjectRegister the subjectRegister to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subjectRegister,
     * or with status {@code 400 (Bad Request)} if the subjectRegister is not valid,
     * or with status {@code 500 (Internal Server Error)} if the subjectRegister couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<SubjectRegister> updateSubjectRegister(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubjectRegister subjectRegister
    ) throws URISyntaxException {
        LOG.debug("REST request to update SubjectRegister : {}, {}", id, subjectRegister);
        if (subjectRegister.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subjectRegister.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subjectRegisterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        subjectRegister = subjectRegisterRepository.save(subjectRegister);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, subjectRegister.getId().toString()))
            .body(subjectRegister);
    }

    /**
     * {@code PATCH  /subject-registers/:id} : Partial updates given fields of an existing subjectRegister, field will ignore if it is null
     *
     * @param id the id of the subjectRegister to save.
     * @param subjectRegister the subjectRegister to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated subjectRegister,
     * or with status {@code 400 (Bad Request)} if the subjectRegister is not valid,
     * or with status {@code 404 (Not Found)} if the subjectRegister is not found,
     * or with status {@code 500 (Internal Server Error)} if the subjectRegister couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<SubjectRegister> partialUpdateSubjectRegister(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody SubjectRegister subjectRegister
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update SubjectRegister partially : {}, {}", id, subjectRegister);
        if (subjectRegister.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, subjectRegister.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!subjectRegisterRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<SubjectRegister> result = subjectRegisterRepository.findById(subjectRegister.getId()).map(subjectRegisterRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, subjectRegister.getId().toString())
        );
    }

    /**
     * {@code GET  /subject-registers} : get all the subjectRegisters.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of subjectRegisters in body.
     */
    @GetMapping("")
    public List<SubjectRegister> getAllSubjectRegisters(@RequestParam(name = "filter", required = false) String filter) {
        if ("mark-is-null".equals(filter)) {
            LOG.debug("REST request to get all SubjectRegisters where mark is null");
            return StreamSupport.stream(subjectRegisterRepository.findAll().spliterator(), false)
                .filter(subjectRegister -> subjectRegister.getMark() == null)
                .toList();
        }
        LOG.debug("REST request to get all SubjectRegisters");
        return subjectRegisterRepository.findAll();
    }

    /**
     * {@code GET  /subject-registers/:id} : get the "id" subjectRegister.
     *
     * @param id the id of the subjectRegister to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the subjectRegister, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<SubjectRegister> getSubjectRegister(@PathVariable("id") Long id) {
        LOG.debug("REST request to get SubjectRegister : {}", id);
        Optional<SubjectRegister> subjectRegister = subjectRegisterRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(subjectRegister);
    }

    /**
     * {@code DELETE  /subject-registers/:id} : delete the "id" subjectRegister.
     *
     * @param id the id of the subjectRegister to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubjectRegister(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete SubjectRegister : {}", id);
        subjectRegisterRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
