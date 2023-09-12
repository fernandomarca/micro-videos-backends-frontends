package com.fullcycle.admin.catalogo;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.test.context.ActiveProfiles;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@ActiveProfiles("test")
@ComponentScan(includeFilters = { @ComponentScan.Filter(type = FilterType.REGEX, pattern = ".[MySQLGateway]") })
@DataJpaTest
@ExtendWith(CleanUpExtension.class)
public @interface MySQLGatewayTest {

}

// @Target(ElementType.TYPE)
// @Retention(RetentionPolicy.RUNTIME)
// @Inherited
// @ActiveProfiles("test-integration")
// @ComponentScan(
// basePackages = "com.fullcycle.admin.catalogo",
// useDefaultFilters = false,
// includeFilters = {
// @ComponentScan.Filter(type = FilterType.REGEX, pattern = ".*MySQLGateway")
// }
// )
// @DataJpaTest
// @ExtendWith(MySQLCleanUpExtension.class)
// @Tag("integrationTest")
// public @interface MySQLGatewayTest {
// }