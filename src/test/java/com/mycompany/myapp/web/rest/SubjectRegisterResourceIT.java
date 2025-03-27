package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.SubjectRegisterAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.SubjectRegister;
import com.mycompany.myapp.repository.SubjectRegisterRepository;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SubjectRegisterResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SubjectRegisterResourceIT {

    private static final String ENTITY_API_URL = "/api/subject-registers";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private SubjectRegisterRepository subjectRegisterRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSubjectRegisterMockMvc;

    private SubjectRegister subjectRegister;

    private SubjectRegister insertedSubjectRegister;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubjectRegister createEntity() {
        return new SubjectRegister();
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static SubjectRegister createUpdatedEntity() {
        return new SubjectRegister();
    }

    @BeforeEach
    public void initTest() {
        subjectRegister = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedSubjectRegister != null) {
            subjectRegisterRepository.delete(insertedSubjectRegister);
            insertedSubjectRegister = null;
        }
    }

    @Test
    @Transactional
    void createSubjectRegister() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the SubjectRegister
        var returnedSubjectRegister = om.readValue(
            restSubjectRegisterMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(subjectRegister)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            SubjectRegister.class
        );

        // Validate the SubjectRegister in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertSubjectRegisterUpdatableFieldsEquals(returnedSubjectRegister, getPersistedSubjectRegister(returnedSubjectRegister));

        insertedSubjectRegister = returnedSubjectRegister;
    }

    @Test
    @Transactional
    void createSubjectRegisterWithExistingId() throws Exception {
        // Create the SubjectRegister with an existing ID
        subjectRegister.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSubjectRegisterMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(subjectRegister)))
            .andExpect(status().isBadRequest());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSubjectRegisters() throws Exception {
        // Initialize the database
        insertedSubjectRegister = subjectRegisterRepository.saveAndFlush(subjectRegister);

        // Get all the subjectRegisterList
        restSubjectRegisterMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(subjectRegister.getId().intValue())));
    }

    @Test
    @Transactional
    void getSubjectRegister() throws Exception {
        // Initialize the database
        insertedSubjectRegister = subjectRegisterRepository.saveAndFlush(subjectRegister);

        // Get the subjectRegister
        restSubjectRegisterMockMvc
            .perform(get(ENTITY_API_URL_ID, subjectRegister.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(subjectRegister.getId().intValue()));
    }

    @Test
    @Transactional
    void getNonExistingSubjectRegister() throws Exception {
        // Get the subjectRegister
        restSubjectRegisterMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSubjectRegister() throws Exception {
        // Initialize the database
        insertedSubjectRegister = subjectRegisterRepository.saveAndFlush(subjectRegister);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the subjectRegister
        SubjectRegister updatedSubjectRegister = subjectRegisterRepository.findById(subjectRegister.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedSubjectRegister are not directly saved in db
        em.detach(updatedSubjectRegister);

        restSubjectRegisterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSubjectRegister.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedSubjectRegister))
            )
            .andExpect(status().isOk());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedSubjectRegisterToMatchAllProperties(updatedSubjectRegister);
    }

    @Test
    @Transactional
    void putNonExistingSubjectRegister() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subjectRegister.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubjectRegisterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, subjectRegister.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(subjectRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSubjectRegister() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subjectRegister.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectRegisterMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(subjectRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSubjectRegister() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subjectRegister.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectRegisterMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(subjectRegister)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSubjectRegisterWithPatch() throws Exception {
        // Initialize the database
        insertedSubjectRegister = subjectRegisterRepository.saveAndFlush(subjectRegister);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the subjectRegister using partial update
        SubjectRegister partialUpdatedSubjectRegister = new SubjectRegister();
        partialUpdatedSubjectRegister.setId(subjectRegister.getId());

        restSubjectRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubjectRegister.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSubjectRegister))
            )
            .andExpect(status().isOk());

        // Validate the SubjectRegister in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSubjectRegisterUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedSubjectRegister, subjectRegister),
            getPersistedSubjectRegister(subjectRegister)
        );
    }

    @Test
    @Transactional
    void fullUpdateSubjectRegisterWithPatch() throws Exception {
        // Initialize the database
        insertedSubjectRegister = subjectRegisterRepository.saveAndFlush(subjectRegister);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the subjectRegister using partial update
        SubjectRegister partialUpdatedSubjectRegister = new SubjectRegister();
        partialUpdatedSubjectRegister.setId(subjectRegister.getId());

        restSubjectRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSubjectRegister.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedSubjectRegister))
            )
            .andExpect(status().isOk());

        // Validate the SubjectRegister in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertSubjectRegisterUpdatableFieldsEquals(
            partialUpdatedSubjectRegister,
            getPersistedSubjectRegister(partialUpdatedSubjectRegister)
        );
    }

    @Test
    @Transactional
    void patchNonExistingSubjectRegister() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subjectRegister.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSubjectRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, subjectRegister.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(subjectRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSubjectRegister() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subjectRegister.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectRegisterMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(subjectRegister))
            )
            .andExpect(status().isBadRequest());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSubjectRegister() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        subjectRegister.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSubjectRegisterMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(subjectRegister)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the SubjectRegister in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSubjectRegister() throws Exception {
        // Initialize the database
        insertedSubjectRegister = subjectRegisterRepository.saveAndFlush(subjectRegister);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the subjectRegister
        restSubjectRegisterMockMvc
            .perform(delete(ENTITY_API_URL_ID, subjectRegister.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return subjectRegisterRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected SubjectRegister getPersistedSubjectRegister(SubjectRegister subjectRegister) {
        return subjectRegisterRepository.findById(subjectRegister.getId()).orElseThrow();
    }

    protected void assertPersistedSubjectRegisterToMatchAllProperties(SubjectRegister expectedSubjectRegister) {
        assertSubjectRegisterAllPropertiesEquals(expectedSubjectRegister, getPersistedSubjectRegister(expectedSubjectRegister));
    }

    protected void assertPersistedSubjectRegisterToMatchUpdatableProperties(SubjectRegister expectedSubjectRegister) {
        assertSubjectRegisterAllUpdatablePropertiesEquals(expectedSubjectRegister, getPersistedSubjectRegister(expectedSubjectRegister));
    }
}
