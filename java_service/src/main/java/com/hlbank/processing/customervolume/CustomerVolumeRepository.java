package com.hlbank.processing.customervolume;

import com.hlbank.processing.customervolume.entity.CustomerVolume;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerVolumeRepository extends CrudRepository<CustomerVolume, Long> {

    @Query("select cv from CustomerVolume cv where cv.customer_uid = :uid and cv.month = :month")
    Iterable<CustomerVolume> findOneByCustomerMonth(
            @Param("uid") String customer_uid,
            @Param("month") int month);

    @Modifying
    @Query("update CustomerVolume set volume = volume + :amount where customer_uid = :uid and month = :month")
    int updateVolume(@Param("amount") Integer amount, @Param("uid") String customer_uid, @Param("month") Integer currentYearMonth);
}
