//
//  SignInVC.swift
//  JobHax
//
//  Created by Yinan Qiu on 8/17/20.
//  Copyright © 2020 Yinan. All rights reserved.
//

import UIKit

class SignInVC: UIViewController {
    
    let emailField = JHTextField()
    let passwordField = JHTextField()
    let signInButton = JHButton()
    let tapRecognizer = UITapGestureRecognizer()

    override func viewDidLoad() {
        super.viewDidLoad()
        configure()
    }

    private func configure() {
        configureView()
        configureEmailField()
        configurePasswordField()
        configureSignInButton()
        layoutSubviews()
    }
    
    private func configureView() {
        view.backgroundColor = .systemBackground
        tapRecognizer.addTarget(view!, action: #selector(view.endEditing(_:)))
        view.addGestureRecognizer(tapRecognizer)
    }
    
    private func configureEmailField() {
        emailField.keyboardType = .emailAddress
        emailField.placeholder = "email"
        view.addSubview(emailField)
    }
    
    private func configurePasswordField() {
        passwordField.placeholder = "password"
        passwordField.isSecureTextEntry = true
        view.addSubview(passwordField)
    }
    
    private func configureSignInButton() {
        signInButton.setTitle("Sign in", for: .normal)
        signInButton.addTarget(self, action: #selector(didTapSignInButton), for: .touchUpInside)
        view.addSubview(signInButton)
    }
    @objc func didTapSignInButton() {
        guard let email = emailField.text, let password = passwordField.text else { return }
        print("email: \(email)\npassword: \(password)")
    }
    
    private func layoutSubviews() {
        NSLayoutConstraint.activate([
            emailField.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 100),
            emailField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 50),
            emailField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -50),
            passwordField.topAnchor.constraint(equalTo: emailField.bottomAnchor, constant: 20),
            passwordField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 50),
            passwordField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -50),
            signInButton.topAnchor.constraint(equalTo: passwordField.bottomAnchor, constant: 20),
            signInButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 50),
            signInButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -50)
        ])
    }
    
}
