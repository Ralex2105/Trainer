package ru.ralex2105.trainer.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import ru.ralex2105.trainer.providers.AuthProvider;
import ru.ralex2105.trainer.services.UserService;
import ru.ralex2105.trainer.filters.JwtFilter;

@Configuration
@EnableWebSecurity
@EnableTransactionManagement
@RequiredArgsConstructor
public class WebSecurityConfig {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthProvider authProvider;

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    protected void securityFilterChain(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authProvider);
    }



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.cors().and()
                .httpBasic().disable()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(
                        (request, response, ex) -> response.sendError(
                                HttpServletResponse.SC_UNAUTHORIZED,
                                ex.getMessage()
                        )
                )
                .and()
                .authorizeHttpRequests(requests -> requests
                        .requestMatchers("/auth/login", "/auth/registration", "/auth/validate", "/auth/token").permitAll()
                        .requestMatchers(HttpMethod.PUT, "/tasks/**").hasAnyAuthority("teacher")
                        .requestMatchers(HttpMethod.POST, "/tasks/**").hasAnyAuthority("teacher")
                        .requestMatchers(HttpMethod.DELETE, "/tasks/**").hasAnyAuthority("teacher")
                        .requestMatchers(HttpMethod.PUT, "/answers/**").hasAnyAuthority("teacher")
                        .requestMatchers(HttpMethod.POST, "/answers/**").hasAnyAuthority("teacher")
                        .requestMatchers(HttpMethod.DELETE, "/answers/**").hasAnyAuthority("teacher")
                        .requestMatchers(HttpMethod.PUT, "/users/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.GET, "/users/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.DELETE, "/users/**").hasAuthority("admin")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasAuthority("teacher")
                        .requestMatchers(HttpMethod.POST, "/categories/**").hasAuthority("teacher")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasAuthority("teacher")
                        .requestMatchers(HttpMethod.PUT, "/markers/**").hasAuthority("teacher")
                        .requestMatchers(HttpMethod.POST, "/markers/**").hasAuthority("teacher")
                        .requestMatchers(HttpMethod.DELETE, "/markers/**").hasAuthority("teacher")
                        .anyRequest().authenticated()
                        .and()
                        .addFilterAfter(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                );


        return http.build();
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setPasswordEncoder(passwordEncoder());
        authenticationProvider.setUserDetailsService(userService);
        return authenticationProvider;
    }
}
