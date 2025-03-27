package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.MarkAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Mark;
import com.mycompany.myapp.repository.MarkRepository;
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
 * Integration tests for the {@link MarkResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MarkResourceIT {

    private static final Float DEFAULT_SCORE = 1F;
    private static final Float UPDATED_SCORE = 2F;

    private static final String ENTITY_API_URL = "/api/marks";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MarkRepository markRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMarkMockMvc;

    private Mark mark;

    private Mark insertedMark;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mark createEntity() {
        return new Mark().score(DEFAULT_SCORE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Mark createUpdatedEntity() {
        return new Mark().score(UPDATED_SCORE);
    }

    @BeforeEach
    public void initTest() {
        mark = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedMark != null) {
            markRepository.delete(insertedMark);
            insertedMark = null;
        }
    }

    @Test
    @Transactional
    void createMark() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Mark
        var returnedMark = om.readValue(
            restMarkMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mark)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Mark.class
        );

        // Validate the Mark in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMarkUpdatableFieldsEquals(returnedMark, getPersistedMark(returnedMark));

        insertedMark = returnedMark;
    }

    @Test
    @Transactional
    void createMarkWithExistingId() throws Exception {
        // Create the Mark with an existing ID
        mark.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMarkMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mark)))
            .andExpect(status().isBadRequest());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMarks() throws Exception {
        // Initialize the database
        insertedMark = markRepository.saveAndFlush(mark);

        // Get all the markList
        restMarkMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(mark.getId().intValue())))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE.doubleValue())));
    }

    @Test
    @Transactional
    void getMark() throws Exception {
        // Initialize the database
        insertedMark = markRepository.saveAndFlush(mark);

        // Get the mark
        restMarkMockMvc
            .perform(get(ENTITY_API_URL_ID, mark.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(mark.getId().intValue()))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingMark() throws Exception {
        // Get the mark
        restMarkMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMark() throws Exception {
        // Initialize the database
        insertedMark = markRepository.saveAndFlush(mark);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the mark
        Mark updatedMark = markRepository.findById(mark.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMark are not directly saved in db
        em.detach(updatedMark);
        updatedMark.score(UPDATED_SCORE);

        restMarkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMark.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMark))
            )
            .andExpect(status().isOk());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMarkToMatchAllProperties(updatedMark);
    }

    @Test
    @Transactional
    void putNonExistingMark() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mark.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMarkMockMvc
            .perform(put(ENTITY_API_URL_ID, mark.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mark)))
            .andExpect(status().isBadRequest());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMark() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mark.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarkMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(mark))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMark() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mark.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarkMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(mark)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMarkWithPatch() throws Exception {
        // Initialize the database
        insertedMark = markRepository.saveAndFlush(mark);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the mark using partial update
        Mark partialUpdatedMark = new Mark();
        partialUpdatedMark.setId(mark.getId());

        restMarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMark.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMark))
            )
            .andExpect(status().isOk());

        // Validate the Mark in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMarkUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMark, mark), getPersistedMark(mark));
    }

    @Test
    @Transactional
    void fullUpdateMarkWithPatch() throws Exception {
        // Initialize the database
        insertedMark = markRepository.saveAndFlush(mark);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the mark using partial update
        Mark partialUpdatedMark = new Mark();
        partialUpdatedMark.setId(mark.getId());

        partialUpdatedMark.score(UPDATED_SCORE);

        restMarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMark.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMark))
            )
            .andExpect(status().isOk());

        // Validate the Mark in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMarkUpdatableFieldsEquals(partialUpdatedMark, getPersistedMark(partialUpdatedMark));
    }

    @Test
    @Transactional
    void patchNonExistingMark() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mark.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMarkMockMvc
            .perform(patch(ENTITY_API_URL_ID, mark.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(mark)))
            .andExpect(status().isBadRequest());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMark() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mark.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarkMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(mark))
            )
            .andExpect(status().isBadRequest());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMark() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        mark.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMarkMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(mark)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Mark in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMark() throws Exception {
        // Initialize the database
        insertedMark = markRepository.saveAndFlush(mark);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the mark
        restMarkMockMvc
            .perform(delete(ENTITY_API_URL_ID, mark.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return markRepository.count();
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

    protected Mark getPersistedMark(Mark mark) {
        return markRepository.findById(mark.getId()).orElseThrow();
    }

    protected void assertPersistedMarkToMatchAllProperties(Mark expectedMark) {
        assertMarkAllPropertiesEquals(expectedMark, getPersistedMark(expectedMark));
    }

    protected void assertPersistedMarkToMatchUpdatableProperties(Mark expectedMark) {
        assertMarkAllUpdatablePropertiesEquals(expectedMark, getPersistedMark(expectedMark));
    }
}
