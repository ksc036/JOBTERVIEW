package ssafy.project.jobterview.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import ssafy.project.jobterview.domain.Question;

@Transactional(readOnly = true)
public interface QuestionRepository extends JpaRepository<Question, Long>, QuestionCustomRepository {}