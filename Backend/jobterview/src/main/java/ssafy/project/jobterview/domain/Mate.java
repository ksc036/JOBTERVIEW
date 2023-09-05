package ssafy.project.jobterview.domain;


import lombok.*;
import ssafy.project.jobterview.dto.MateDto;

import javax.persistence.*;

@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Mate extends BaseTimeEntity {

    @EmbeddedId
    private MateId mateId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "from_member_id")
    @MapsId("fromMemberId")
    private Member fromMember;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "to_member_id")
    @MapsId("toMemberId")
    private Member toMember;

    public Mate(MateId mateId, Member fromMember, Member toMember) {
        this.mateId = mateId;
        this.fromMember = fromMember;
        this.toMember = toMember;
    }

    public MateDto convertToDto() {
        return MateDto.builder()
                .mateId(this.getMateId())
                .fromMemberNickname(this.getFromMember().getNickname())
                .toMemberNickname(this.getToMember().getNickname())
                .build();
    }
}